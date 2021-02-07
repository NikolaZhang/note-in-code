import { INoteCommand } from './INoteCommand';
import { Disposable, Uri } from 'vscode';
import * as vscode from 'vscode';
import { IMakeComponent } from '../../IMakeComponent';

/**
 * 模板配置命令
 *
 * @author: zhangxu
 */
export class TemplateCommand extends INoteCommand implements IMakeComponent {

    category: string = "template";

    apply(context: vscode.ExtensionContext): void {
        let add = vscode.commands.registerCommand(this.getCmdName("add"), () => {
            this.add();
        });

        context.subscriptions.push(add);
    }

    init() { 
        let conf = vscode.workspace.getConfiguration("nic");
        let url = conf.get<string>("url");
        let uri: Uri;
        if (url) {
            try {
                uri = Uri.parse(url, true);
            } catch (error) {
                console.warn('you\'d better config nic.url for template path, she will create it in .vscode if not exist!');
                conf = vscode.workspace.getConfiguration('niko.json', vscode.workspace.workspaceFolders[0]);
            }
        }
        vscode.workspace.fs.createDirectory(uri);
    }


    /**
     * 添加模板
     */
    add() {
        const conf = vscode.workspace.getConfiguration("nic");
        let url = conf.get<string>("url");
        if (url) {
            let template: string;
            vscode.workspace.fs.readFile(vscode.Uri.parse(url)).then(res => {
                template = res.toString();
            });
        } else {
            vscode.window.showInformationMessage('请在settings.json中配置nic.url指定模板文件路径');
        }
    }
}