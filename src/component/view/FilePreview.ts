import { ExtensionContext } from "vscode";
import * as vscode from "vscode";
import { IMakeComponent } from "./../IMakeComponent";
import * as path from "path";
import { DefaultPreviewPropertyBuilder, PreviewProperty } from "../../entity/PreviewProperty";
import { BasePreview, IPreview } from "./IPreview";
import { CodeRegionResolver } from "../../core/CodeRegionResolver";
import { CodeRegion } from "../../entity/CodeRegion";

class FilePreview extends BasePreview implements IMakeComponent {
    apply(context: ExtensionContext): void {
        let nicView = vscode.commands.registerCommand("nic.view", (uri) => {
            const panel = vscode.window.createWebviewPanel("nicView", "note in code view", vscode.ViewColumn.Two, {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, "resources", "css")),
                    vscode.Uri.file(path.join(context.extensionPath, "resources", "js")),
                    vscode.Uri.file(path.join(context.extensionPath, "resources", "html")),
                ],
                // retainContextWhenHidden: true,
            });

            // 1. 获取所有的codeRegions
            let codeRegionResolver = new CodeRegionResolver();
            let codeRegions: Array<CodeRegion> = codeRegionResolver.doResolve();

            // 2. 获取代码封装后样式
            let slot = "";
            codeRegions.forEach((item, index) => {
                let prop = DefaultPreviewPropertyBuilder.newInstance(item);
                slot += this.getCodeStyle(prop);
            });

            // 3. 设置网页内容
            let webContent = this.getWebViewContent(context, "resources/html/CodeViewPanel.html", slot);
            panel.webview.html = webContent;

            panel.onDidDispose(
                (e) => {
                    // 当面板关闭时，取消webview内容之后的更新
                    console.log("关闭", e);
                },
                null,
                context.subscriptions
            );
        });
        context.subscriptions.push(nicView);
    }
}

export { FilePreview };
