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
        // todo zx 当配置出现多行的时候需要考虑到解析方法 使用json方式进行配置并不好 如果配置较多代码一般比较喜欢换行因此至少需要考虑换行情况
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
