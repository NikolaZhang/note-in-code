import { Disposable } from "vscode";
import { IMakeComponent } from "../IMakeComponent";
import * as vscode from 'vscode';

export class HelloWorld implements IMakeComponent {

    apply(context: vscode.ExtensionContext): void {
        context.subscriptions.push(vscode.commands.registerCommand('note-in-code.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from note-in-code!');
        }));
    }

}