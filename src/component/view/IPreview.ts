import { PreviewProperty } from "../../entity/PreviewProperty";
import { ExtensionContext } from "vscode";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface IPreview {
    /**
     * 获取代码块样式展示
     * @param prop prism 需要传入的属性配置
     */
    getCodeStyle(prop: PreviewProperty): string;
}

// truly speaking, i don't wanna u do more things in subclass to implement IPreview interface.
// so i code this abstract class for common html style codes generation.
// if u really wanna customize html codes, u'd better overwrite these two methods.
abstract class BasePreview implements IPreview {
    /**
     * 获取代码块格式
     * @param prop 需要传给代码块的属性配置
     */
    getCodeStyle(prop: PreviewProperty): string {
        // todo zx 代码出现缩进问题
        if (!prop.codes || prop.codes.length === 0) {
            return "";
        }
        let codeTemplate = "";
        prop.codes.forEach((item, index) => {
            codeTemplate += `
                <p>代码块${index + 1}:</p>
                <pre class="${prop.classes}">
                    <code >
                    ${item}
                    </code>
                </pre>
            `;
        });
        return codeTemplate;
    }

    /**
     * 加载web 网页程序
     * 参考代码 https://www.cnblogs.com/liuxianan/p/vscode-plugin-webview.html
     * @param context 上下文
     * @param templatePath 模板路径
     * @param slot 需要加载的网页代码
     */
    getWebViewContent(context: ExtensionContext, templatePath: string, slot: string) {
        const resourcePath = path.join(context.extensionPath, templatePath);
        const dirPath = path.dirname(resourcePath);
        let html = fs.readFileSync(resourcePath, "utf-8");
        // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
        html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: "vscode-resource" }).toString() + '"';
        });
        // 对定制化参数进行处理 一些页面需要展示的动态数据, 我们使用占位符写入页面, 以下程序直接替换这些占位符
        // better zx 当然占位符过多对性能的负影响就会翻倍
        html = html.replace("${slot}", slot);
        return html;
    }
}

export { IPreview, BasePreview };
