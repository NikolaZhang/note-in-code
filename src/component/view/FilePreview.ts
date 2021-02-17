import { ExtensionContext } from "vscode";
import * as vscode from "vscode";
import { IMakeComponent } from "./../IMakeComponent";
import * as path from "path";
import { PreviewProperty } from "../../entity/PreviewProperty";
import { BasePreview, IPreview } from "./IPreview";

class FilePreview extends BasePreview implements IMakeComponent {
    /** 全局的模板持有者， 每次都需要使用其拼接最新的文本 */
    viewHtml: string;

    apply(context: ExtensionContext): void {
        let nicView = vscode.commands.registerCommand("nic.view", (uri) => {
            const panel = vscode.window.createWebviewPanel(
                "nicView",
                "note in code view",
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    // todo zx 资源加载配置
                    localResourceRoots: [
                        vscode.Uri.file(
                            path.join(context.extensionPath, "media")
                        ),
                    ],
                    // retainContextWhenHidden: true,
                }
            );

            // todo zx 获取代码块
            let slot = "";
            panel.webview.html = this.getWebViewContent(slot);

            panel.onDidDispose(
                () => {
                    // 当面板关闭时，取消webview内容之后的更新
                },
                null,
                context.subscriptions
            );
        });
        context.subscriptions.push(nicView);
    }

    getCodeRegion(prop: PreviewProperty): string {
        let codeTemplate = `
            <pre>
                <code class="${prop.classes}">
                    ${prop.codes}
                </code>
            </pre>
        `;
        return (this.viewHtml ? this.viewHtml : "") + codeTemplate;
    }
}

export { FilePreview };
