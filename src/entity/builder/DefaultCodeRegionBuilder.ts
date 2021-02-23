import { Position, Range, TextDocument, TextLine } from "vscode";
import { convertJson } from "../../util/ObjectUtils";
import { CodeRegion } from "../CodeRegion";
import { BeginEntity, DEFAULT_MAX_SCAN_LINE } from "../TemplateEntity";

class DefaultCodeRegionBuilder {
    static newInstance(doc: TextDocument, textLine: TextLine): CodeRegion {
        let codeRegion = new CodeRegion();
        codeRegion.sourceLine = textLine;
        codeRegion.begin = this.decodeBeginEntity(textLine, doc);
        codeRegion.contents = this.decodeContents(codeRegion.begin, textLine, doc);
        codeRegion.note = codeRegion.begin.description;
        return codeRegion;
    }

    /**
     * 解析textLine中的配置
     * @param textLine 当前行信息
     */
    private static decodeBeginEntity(textLine: TextLine, doc: TextDocument): BeginEntity {
        // 基于json的配置解析, 如果风格化插件导致json换行, 此处代码进行了兼容性处理.
        // 但是只是进行了json的校验而非对错误的json进行处理.
        // 一般配置json 需要让nic配置单独作为一个区域使代码间至少有一行空行
        
        // 出现多行的配置需要使用[]进行区域标识
        // 支持属性配置
        // 如果指定methods则取获取指定的方法, 否则获取下面注释的代码
        /**
         * nic
         * title=xxx tag=xxx,xxx type=xxx
         * note=[
         *   ## xxxxxxx
         *
         *   ### xxxxxxx
         *     - xxxxxxx
         *     - xxxxxx
         * ]
         * methods=xxx,xxx
         */

        let tempTextLine: TextLine;
        // 推测使用的注释标记
        // better zx 配置话读取nic 错误提示
        const commentSymbol = textLine.text.substring(0, textLine.text.indexOf("nic")).trim();
        if (!commentSymbol) {
            throw new Error("nic前缺少注释符号");
        }
        let commentText = "";
        // 表示当前使用nic注释的行数
        // 当codeBegin设置为0时我们使用这个数值进行覆盖,
        // 以此来防止nic注释被放到webview中
        let commentLineCount = 0;
        for (let i = 0; ; i++) {
            tempTextLine = doc.lineAt(textLine.lineNumber + i);
            if (tempTextLine.isEmptyOrWhitespace) {
                commentLineCount = i;
                break;
            }
            if (tempTextLine.text.trimLeft().startsWith(commentSymbol)) {
                commentText += tempTextLine.text.replace(commentSymbol, "").trim();
            } else {
                commentLineCount = i;
                break;
            }
        }
        // 大括号计数 以此来确定json字符串的开始start和结束end位置
        let curlyBracesCnt = 0;
        let start = 0;
        let end = 0;
        for (let i = 0; i < commentText.length; i++) {
            if (commentText.charAt(i) === "{") {
                start = i;
                curlyBracesCnt++;
            }
            if (commentText.charAt(i) === "}") {
                curlyBracesCnt--;
                if (curlyBracesCnt === 0) {
                    end = i;
                    break;
                }
            }
        }
        if (curlyBracesCnt !== 0) {
            throw new Error("json配置格式错误!");
        }
        let config = commentText.substring(start, end + 1);
        let beginInfo = new BeginEntity();
        if (config) {
            convertJson(config, beginInfo);
            if (beginInfo.codeBegin === 0) {
                beginInfo.codeBegin = commentLineCount;
            }
        }
        return beginInfo;
    }

    /**
     * 解析BeginEntity， 获取代码内容
     * @param begin 原始BeginEntity信息
     * @param sourceLine 原始行信息
     * @param doc 原始文档信息
     */
    private static decodeContents(begin: BeginEntity, sourceLine: TextLine, doc: TextDocument): Array<string> {
        // 1. 当配置了methods属性， 我们需要获取相应的方法
        let methods = begin.methods;
        if (methods && methods.length !== 0) {
            // 如果设置了methods需要获取所有匹配的方法, 这里需要将文件扫描一遍, 获取所有匹配的方法
            let contents: Array<string> = this.findMethods(methods, doc);
            return contents;
        }

        // 2. 没有设置method，分为两种情况
        // 2.1 指定codeEnd 我们获取当前注释到codeEnd的代码区域
        // 2.2 没有指定codeEnd 我们获取注释下的一个方法
        let currentLineNumber = sourceLine.lineNumber;
        let codeBegin = currentLineNumber + (begin.codeBegin ? begin.codeBegin : 1);
        // 基于codeBegin和codeEnd查找方法实在是没有人性
        // 肯定有人会说几百行代码居然要自己算好
        // 但无疑这种方式是最高效的
        let content = "";
        // 根据是否配置codeEnd判断是解析指定位置还是解析出下面的一个方法
        if (begin.codeEnd) {
            let codeEnd = currentLineNumber + (begin.codeEnd ? begin.codeEnd : DEFAULT_MAX_SCAN_LINE);
            let code = "";
            content = doc.getText(new Range(new Position(codeBegin, 0), new Position(codeEnd + 1, 0)));
        } else {
            // 基于开始行 进行自动匹配一个方法
            // better zx 性能差 寻找性能优化方案
            let option = this.findMethod(doc.lineAt(codeBegin), doc);
            content = option.content;
        }
        return [content];
    }

    /**
     * 查找当前文件中匹配方法(方法开始行的唯一字符串信息)的代码块
     * @param methods 方法名数组
     * @param doc 当前文件对象
     */
    private static findMethods(methods: Array<string>, doc: TextDocument): Array<string> {
        let textLine: TextLine;
        // 已经查找的方法计数 当查找完方法后直接退出循环的计数标记
        let methodCount = 0;
        let methodContents: Array<string> = [];
        for (let i = 0; i < doc.lineCount && methodCount < methods.length; i++) {
            textLine = doc.lineAt(i);
            if (textLine.text.trimLeft().startsWith("//")) {
                continue;
            }
            for (let m of methods) {
                if (textLine.text.indexOf(m) !== -1) {
                    let curlyBracesCnt = 0;
                    let searchEndFlag = false;
                    methodCount++;
                    let option = this.findMethod(textLine, doc);
                    i = option.lineNumber;
                    if (option.content !== "") {
                        methodContents.push(option.content);
                    }
                }
            }
        }
        return methodContents;
    }

    /**
     * 查找当前行之后的一个方法, 并且不拼接nic注释
     * @param textLine 当前行
     * @param doc 当前文件
     */
    private static findMethod(textLine: TextLine, doc: TextDocument): { lineNumber: number; content: string } {
        let curlyBracesCnt = 0;
        let searchEndFlag = false;
        let methodContent = "";
        let lineGo = textLine.lineNumber;
        // 用于判断是否为nic注释的区域
        let isNicFlag = false;
        for (; textLine.lineNumber < doc.lineCount; ) {
            if (textLine.text.indexOf("nic") !== -1) {
                isNicFlag = true;
            }
            if (textLine.isEmptyOrWhitespace) {
                isNicFlag = false;
            }
            if (textLine.text.trimLeft().startsWith("//")) {
                // 对于不是nic注释可以直接拼在代码块中, 但是不应该统计括号数
                if (!isNicFlag) {
                    methodContent += textLine.text + "\n";
                }
                continue;
            } else {
                methodContent += textLine.text + "\n";
            }
            // 遍历每一行的字符计算大括号数量
            for (let j = 0; j < textLine.text.length; j++) {
                if (textLine.text.charAt(j) === "{") {
                    curlyBracesCnt++;
                }
                if (textLine.text.charAt(j) === "}") {
                    curlyBracesCnt--;
                    if (curlyBracesCnt <= 0) {
                        searchEndFlag = true;
                        break;
                    }
                    // 对于将nic配置在方法内部的情况， 括号计数小于0应该算作结束， 而不能认为是错误
                    // if (curlyBracesCnt <= 0) {
                    //     throw new Error("代码格式错误");
                    // }
                }
            }
            if (searchEndFlag) {
                // 方法搜索结束
                break;
            } else {
                // 继续看下一行
                textLine = doc.lineAt(++lineGo);
            }
        }
        return { lineNumber: lineGo, content: methodContent };
    }
}

export { DefaultCodeRegionBuilder };
