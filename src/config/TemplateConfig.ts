import { IConfig } from "./IConfig";
import * as vscode from "vscode";
import {
    NIC_TEMPLATE,
    TemplateCommand,
} from "../component/command/TemplateCommand";
import { CodeRegion } from "../entity/CodeRegion";
import { TemplateEntity } from "../entity/TemplateEntity";

/**
 * 加载模板配置信息
 */
class TemplateConfig implements IConfig {
    /**
     * 加载与当前文件匹配的模板
     */
    loadConfig(): TemplateEntity {
        let templates = vscode.workspace
            .getConfiguration()
            .get<Array<TemplateEntity>>(NIC_TEMPLATE);
        if (!templates || templates.length === 0) {
            vscode.window.showErrorMessage(
                "啥也没有啊~ 赶快配置一个... 详见插件介绍[nic.template]"
            );
            return null;
        }

        // 获取当前文件的后缀进行匹配
        let fileName = vscode.window.activeTextEditor.document.fileName;
        let template = templates.find((item) => {
            return fileName.endsWith(item.type);
        });
        if (!template) {
            // 没有与当前格式匹配的模板
            return null;
        }
        return template;
    }
}

export { TemplateConfig };
