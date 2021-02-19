import { Position, Range, TextDocument, TextLine } from "vscode";
import { convertJson } from "../util/ObjectUtils";
import { BeginEntity, DEFAULT_MAX_SCAN_LINE } from "./TemplateEntity";

class CodeRegion {
    begin: BeginEntity;
    sourceLine: TextLine;
    contents: Array<string> = [];
}

class DefaultCodeRegionBuilder {
    static newInstance(doc: TextDocument, textLine: TextLine): CodeRegion {
        let codeRegion = new CodeRegion();
        codeRegion.sourceLine = textLine;
        codeRegion.begin = DefaultCodeRegionBuilder.decodeBeginEntity(textLine, doc);
        codeRegion.contents = DefaultCodeRegionBuilder.decodeContents(codeRegion.begin, textLine, doc);
        return codeRegion;
    }

    /**
     * 解析textLine中的配置
     * @param textLine 当前行信息
     */
    private static decodeBeginEntity(textLine: TextLine, doc: TextDocument): BeginEntity {
        // 基于json的配置解析, 如果风格化插件导致json换行, 此处代码进行了兼容性处理. 
        // 但是只是进行了json的校验而非对错误的json进行处理
        // todo zx 以区域注释的方式进行解析 并且支持markdown方式
        // 出现多行的配置需要使用[]进行区域标识
        // 支持属性配置
        // 如果指定methods则取获取指定的方法, 否则获取下面注释的代码
        /**
         * nic
         * title=xxx tag=xxx,xxx type=xxx
         * note=[
         *   ## xxxxxxx
         *   ### xxxxxxx
         *     - xxxxxxx
         *     - xxxxxx
         * ]
         * methods=xxx,xxx
         */
        let tempTextLine: TextLine;
        // 推测使用的注释标记
        const commentSymbol = textLine.text.substring(0, textLine.text.indexOf("nic")).trim();
        let commentText = "";
        for (let i = 0; ; i++) {
            tempTextLine = doc.lineAt(textLine.lineNumber + i);
            if (tempTextLine.isEmptyOrWhitespace) {
                continue;
            }
            if (tempTextLine.text.trimLeft().startsWith(commentSymbol)) {
                commentText += tempTextLine.text.replace(commentSymbol, "").trim();
            } else {
                break;
            }
        }
        // 大括号计数 以此来确定json字符串的开始和结束位置
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
        console.debug("注释文本为", commentText);
        if (curlyBracesCnt !== 0) {
            throw new Error("json配置格式错误!");
        }
        let config = commentText.substring(start, end + 1);
        let beginInfo = new BeginEntity();
        if (config) {
            convertJson(config, beginInfo);
        }
        return beginInfo;
    }

    /**
     * 解析BeginEntity
     * @param begin 原始BeginEntity信息
     * @param sourceLine 原始行信息
     * @param doc 原始文档信息
     */
    private static decodeContents(begin: BeginEntity, sourceLine: TextLine, doc: TextDocument): Array<string> {
        let methods = begin.methods;
        if (methods && methods.length !== 0) {
            let contents: Array<string> = [];
            // todo zx 如果设置了methods需要获取所有匹配的方法, 这里需要将文件扫描一遍, 获取所有匹配的方法
            let bracketCnt = 0;
            return [];
        }

        // 没有设置method
        let currentLineNumber = sourceLine.lineNumber;
        let codeBegin = currentLineNumber + (begin.codeBegin ? begin.codeBegin : 1);
        let codeEnd = currentLineNumber + (begin.codeEnd ? begin.codeEnd : DEFAULT_MAX_SCAN_LINE);
        let code = "";

        let content = doc.getText(new Range(new Position(codeBegin, 0), new Position(codeEnd + 1, 0)));
        return [content];
    }
}

export { CodeRegion, DefaultCodeRegionBuilder };
