import { PreviewProperty } from "../../entity/PreviewProperty";

interface IPreview {
    /**
     * 获取代码块样式展示
     * @param prop prism 需要传入的属性配置
     */
    getCodeRegion(prop: PreviewProperty): string;

    /**
     * 加载web 网页程序
     * @param slot 需要加载的网页代码
     */
    getWebViewContent(slot: string): string;
}

abstract class BasePreview implements IPreview {
    abstract getCodeRegion(prop: PreviewProperty): string;

    getWebViewContent(slot: string): string {
        return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>note in code view</title>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism.css"
                />
            </head>
            <body>
                <div>${slot}</div>
                <script src="https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/prismjs@1.23.0/prism.min.js"></script>
            </body>
        </html>
        `;
    }
}

export { IPreview, BasePreview };
