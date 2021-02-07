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
        let update = vscode.commands.registerCommand(this.getCmdName("update"), () => {
            this.update();
        });
        let remove = vscode.commands.registerCommand(this.getCmdName("remove"), () => {
            this.remove();
        });
        let query = vscode.commands.registerCommand(this.getCmdName("query"), () => {
            this.query();
        });

        context.subscriptions.push(add, update, remove, query);
    }

    init() { 
        let conf = vscode.workspace.getConfiguration('niko.json', vscode.workspace.workspaceFolders[0]);
        let fileRoot = vscode.workspace.workspaceFolders[0].uri;
        vscode.workspace.fs.createDirectory(Uri.joinPath(fileRoot, 'templates'));
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

    // todo zx finish those method
    update() { }
    remove() { }
    query() { }
}