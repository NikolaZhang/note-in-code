import { release } from "process";
import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";
import { TextDocument, Uri, WorkspaceConfiguration } from "vscode";
import { format } from "../../../utils/StringUtils";
import { IMakeComponent } from "../../IMakeComponent";
import { Template } from "../entity/TemplateEntity";
import { BaseNoteCommand } from "./BaseNoteCommand";

/**
 * 模板配置命令
 *
 * @author: zhangxu
 */
const NIC_TEMPLATE = "nic.template";
const SCOPE = true;
export class TemplateCommand extends BaseNoteCommand implements IMakeComponent {
    category: string = "template";

    template = new Template("cm", "this is used for multiple lines", "java", ["// [nic[", "// ]]"]);

    constructor() {
        super();
        this.init();
    }

    protected getCategory(): string {
        return this.category;
    }

    apply(context: vscode.ExtensionContext): void {
        let change = vscode.commands.registerCommand(
            this.getCmdName("change"),
            () => {
                this.addOrUpdate();
            }
        );
        let remove = vscode.commands.registerCommand(
            this.getCmdName("remove"),
            () => {
                this.remove();
            }
        );
        let list = vscode.commands.registerCommand(
            this.getCmdName("list"),
            () => {
                this.list();
            }
        );

        context.subscriptions.push(change, remove, list);
    }

    check(): boolean {
        // more check
        return super.check(NIC_TEMPLATE);
    }

    /**
     * 初始化模板配置需要的路径和文件
     */
    init() {
        if (!this.check()) {
            // 设置配置
            console.info("没有发现nic配置, 初始化ing");
            let templates = [];
            templates.push(this.template);
            vscode.workspace
                .getConfiguration()
                .update(NIC_TEMPLATE, templates, SCOPE);
        }
    }

    /**
     * 添加key不存在的模板, 修改key已经存在的模板
     */
    addOrUpdate() {
        vscode.window
            .showInputBox({
                placeHolder: "请填写模板",
                validateInput: (val) => {
                    try {
                        let template: Template = JSON.parse(val);
                        return template.check();
                    } catch (error) {
                        return "模板格式不对啊~ 需要是json格式的字符串鸭~";
                    }
                },
            })
            .then((val) => {
                if (val === undefined) {
                    return;
                }
                console.log("获取:", val);
                // 将模板追加到文件中
                let templates = vscode.workspace
                    .getConfiguration()
                    .get<Array<Template>>(NIC_TEMPLATE);

                // 1. 获取之前的配置和当前配置
                let current: Template = JSON.parse(val);
                // 2. 校验之前的文件中是否不存在当前的key 如果存在当前key, 则直接更新; 否则直接添加当前模板
                let flag: boolean = false;
                templates.every((item, index) => {
                    if (item.key === current.key) {
                        templates[index] = current;
                        flag = true;
                        return false;
                    }
                    return true;
                });
                if (!flag) {
                    templates.push(current);
                }

                // 3. 将最新的模板配置写入文件
                vscode.workspace
                    .getConfiguration()
                    .update(NIC_TEMPLATE, templates, SCOPE);
                vscode.window.showInformationMessage("恭喜, 模板配置成功啦~!");
            });
    }
    /**
     * 删除指定key的模板
     */
    remove() {
        vscode.window
            .showInputBox({
                placeHolder: "请填写要删除的模板key值",
            })
            .then((val) => {
                // 将模板追加到文件中
                // 1. 获取之前的配置
                let templates = vscode.workspace
                    .getConfiguration()
                    .get<Array<Template>>(NIC_TEMPLATE);

                // 2. 将原来的模板过滤
                templates = templates.filter((item) => {
                    return item.key !== val;
                });

                // 3. 将最新的模板配置写入文件
                vscode.workspace
                    .getConfiguration()
                    .update(NIC_TEMPLATE, templates, SCOPE);
                vscode.window.showErrorMessage("居然不要它了~!");
            });
    }
    list() {
        let templates = vscode.workspace
            .getConfiguration()
            .get<Array<Template>>(NIC_TEMPLATE);
        if (!templates || templates.length === 0) {
            vscode.window.showErrorMessage(
                "啥也没有啊~ 赶快配置一个... 详见插件介绍[nic.template]"
            );
        } else {
            vscode.window
                .showQuickPick(templates.map((item) => item.key))
                .then((val) => {
                    let res = templates.filter((item) => {
                        return item.key === val;
                    });
                    vscode.window.showInformationMessage(JSON.stringify(res[0]));
                });
        }
    }

    // ~ ===================================================================
    // private methods
    // ~ ===================================================================
}
