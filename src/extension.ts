import { TemplateCommand } from './component/notebook/command/TemplateCommand';
import * as vscode from 'vscode';
import { HelloWorld } from './component/hello/HelloWorld';
import { BaseNoteCommand } from './component/notebook/command/BaseNoteCommand';
import { IMakeComponent } from './component/IMakeComponent';

export function activate(context: vscode.ExtensionContext) {

    console.info('Congratulations, your extension "note-in-code" is now active!');
    let cmd: TemplateCommand = new TemplateCommand();
    cmd.apply(context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
