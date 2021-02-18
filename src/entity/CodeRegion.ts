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
        codeRegion.begin = DefaultCodeRegionBuilder.decodeBeginEntity(textLine);
        codeRegion.contents = DefaultCodeRegionBuilder.decodeContents(codeRegion.begin, textLine, doc);
        return codeRegion;
    }

    /**
     * 解析textLine中的配置
     * @param textLine 当前行信息
     */
    private static decodeBeginEntity(textLine: TextLine): BeginEntity {
        // better zx 基于json的配置解析, 注意json只能在一行之中, 如果风格化插件导致json换行会出现json格式错误
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
        let start = textLine.text.indexOf("{");
        let end = textLine.text.lastIndexOf("}");
        let config = textLine.text.substring(start, end + 1);
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
