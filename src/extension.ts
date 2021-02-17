import { TemplateCommand } from "./component/command/TemplateCommand";
import * as vscode from "vscode";
import { BaseNoteCommand } from "./component/command/BaseNoteCommand";
import { IMakeComponent } from "./component/IMakeComponent";
import { FilePreview } from "./component/view/FilePreview";

export function activate(context: vscode.ExtensionContext) {
    console.info(
        'Congratulations, your extension "note-in-code" is now active!'
    );
    let cmd = new TemplateCommand();
    cmd.apply(context);

    // 文件预览
    let filePreview = new FilePreview();
    filePreview.apply(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
