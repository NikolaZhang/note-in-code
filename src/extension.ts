import { TemplateCommand } from './component/notebook/command/TemplateCommand';
import * as vscode from 'vscode';
import { HelloWorld } from './component/hello/HelloWorld';

export function activate(context: vscode.ExtensionContext) {

    console.info('Congratulations, your extension "note-in-code" is now active!');
    new HelloWorld().apply(context);
    new TemplateCommand().init();

}

// this method is called when your extension is deactivated
export function deactivate() { }
