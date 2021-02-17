import { ExtensionContext } from "vscode";
import { IMakeComponent } from "../IMakeComponent";
import { BaseNoteCommand } from "./BaseNoteCommand";

// todo zx 当用户输入模板的代码时获取模板并写入文件
export class FileCommand extends BaseNoteCommand implements IMakeComponent {
    apply(context: ExtensionContext): void {
        throw new Error("Method not implemented.");
    }
    protected getCategory(): string {
        return "file";
    }
}
