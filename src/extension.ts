import { TemplateCommand } from './component/notebook/command/TemplateCommand';
import * as vscode from 'vscode';
import { HelloWorld } from './component/hello/HelloWorld';

export function activate(context: vscode.ExtensionContext) {

    console.info('Congratulations, your extension "note-in-code" is now active!');
    console.info(vscode.workspace.workspaceFolders);
    console.info(vscode.workspace.workspaceFolders[0]);
    new HelloWorld().apply(context);
    new TemplateCommand().apply(context);

}

// this method is called when your extension is deactivated
export function deactivate() { }