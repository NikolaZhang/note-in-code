import { TextLine } from "vscode";
import { convertJson } from "../util/ObjectUtils";
import { BeginEntity } from "./TemplateEntity";

class CodeRegion {
    begin: BeginEntity;
    sourceLine: TextLine;
    contents: Array<string> = [];
}

class DefaultCodeRegionBuilder {
    static newInstance(textLine: TextLine): CodeRegion {
        let codeRegion = new CodeRegion();
        codeRegion.sourceLine = textLine;
        codeRegion.begin = DefaultCodeRegionBuilder.decodeTextLine(textLine);
        return codeRegion;
    }

    private static decodeBeginEntity(textLine: TextLine): BeginEntity {
        let start = textLine.text.indexOf("{");
        let end = textLine.text.lastIndexOf("}");
        let config = textLine.text.substring(start, end + 1);
        let beginInfo = new BeginEntity();
        if (config) {
            convertJson(config, beginInfo);
        }
        return beginInfo;
    }

    private static decodeContents(begin: BeginEntity, sourceLine: TextLine) {
        
    }
}

export { CodeRegion, DefaultCodeRegionBuilder };
