import { TextLine } from "vscode";
import { BeginEntity } from "./TemplateEntity";

class CodeRegion {
    begin: BeginEntity;
    sourceLine: TextLine;
    contents: Array<string> = [];
    note: string = "";
}

export { CodeRegion };
