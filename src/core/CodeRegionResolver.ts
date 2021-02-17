import * as vscode from "vscode";
import {
    NIC_TEMPLATE,
    TemplateCommand,
} from "../component/command/TemplateCommand";
import { CodeRegion, DefaultCodeRegionBuilder } from "../entity/CodeRegion";
import { BeginEntity, TemplateEntity } from "../entity/TemplateEntity";
import { TemplateConfig } from "../config/TemplateConfig";

/**
 * 模板解析类
 */
class CodeRegionResolver implements IResolver {
    /**
     * 解析含有模板配置的区域， 每次使用模板配置的地方我们都认为他是一个区域region。
     * 因此需要考虑到模板嵌套使用的情况
     */
    doResolve(): Array<CodeRegion> {
        let doc = vscode.window.activeTextEditor.document;
        let text = doc.getText();
        const lineCount = doc.lineCount;
        // 1. 获取模板配置信息 之后解析需要根据该配置进行字符串匹配
        let templateConfig = new TemplateConfig();
        let template = templateConfig.loadConfig();

        // 2. 遍历当前文件的所有行 每次有匹配到开始标记就进行解析
        // regions 用于保留每个代码注释块的区域信息
        let regions: Array<CodeRegion> = [];
        let textLine;
        for (let i = 0; i < lineCount; i++) {
            textLine = doc.lineAt(i);
            if (textLine.isEmptyOrWhitespace) {
                continue;
            }
            if (textLine.text.indexOf(template.beginFlag)) {
                // 匹配到开始标志 直接去解析模板开始信息配置, 目前配置只能在一行，并且为json格式
                let codeRegion = DefaultCodeRegionBuilder.newInstance(textLine);
                regions.push(codeRegion);
            }
        }
        return regions;
    }
}
