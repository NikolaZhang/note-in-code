import { release } from "process";
import { TextEncoder } from "util";
import * as vscode from "vscode";
import { Uri, WorkspaceConfiguration } from "vscode";
import { IMakeComponent } from "../../IMakeComponent";
import { BaseNoteCommand } from "./BaseNoteCommand";

/**
 * 模板配置命令
 *
 * @author: zhangxu
 */
const TEMPLATE_PATH = "nic.template.path";
export class TemplateCommand extends BaseNoteCommand implements IMakeComponent {
  category: string = "template";
  templates: string = `
        {
            "cc": ["[nic-begin title=$1 ["
                
            ]nic-end]\n"],
            "cf": "[nic-begin[$1]nic-end]"
        }
    `;

  constructor() {
    super();
    this.init();
  }

  protected getCategory(): string {
    return this.category;
  }

  apply(context: vscode.ExtensionContext): void {
    let add = vscode.commands.registerCommand(this.getCmdName("add"), () => {
      this.add();
    });
    let update = vscode.commands.registerCommand(
      this.getCmdName("update"),
      () => {
        this.update();
      }
    );
    let remove = vscode.commands.registerCommand(
      this.getCmdName("remove"),
      () => {
        this.remove();
      }
    );
    let query = vscode.commands.registerCommand(
      this.getCmdName("query"),
      () => {
        this.query();
      }
    );

    context.subscriptions.push(add, update, remove, query);
  }

  check(): boolean {
    // more check
    return super.check(TEMPLATE_PATH);
  }

  /**
   * 初始化模板配置需要的路径和文件
   */
  init() {
    if (!this.check()) {
      console.warn(
        "cannot find nic config, we create it under current workspace, " +
          "named nic_template.json with directory .nic!"
      );
      let fileRoot = vscode.workspace.workspaceFolders[0].uri;
      let targetDir: Uri = Uri.joinPath(fileRoot, ".nic");
      // 在当前目录下创建 .nic目录, 并添加nic.json文件
      vscode.workspace.fs.createDirectory(targetDir);
      let filePath: Uri = Uri.joinPath(targetDir, "nic_template.json");

      vscode.workspace.fs.writeFile(
        filePath,
        new TextEncoder().encode(this.templates)
      );

      // 更新配置路径
      vscode.workspace.getConfiguration().update(TEMPLATE_PATH, filePath.path);
      console.info("now we put templates under " + filePath.path);
    }
  }

  /**
   * 添加模板
   */
  // todo zx finish those method
  add() {
    vscode.window
      .showInputBox({
        placeHolder: "请添加模板",
        validateInput: (val) => {
          try {
            return JSON.parse(val);
          } catch (error) {
            console.log("模板格式错误");
            return null;
          }
        },
      })
      .then((val) => {
        // 将模板追加到文件中
        let path: string = vscode.workspace
          .getConfiguration()
          .get<string>(TEMPLATE_PATH);
        vscode.workspace.fs.writeFile(Uri.parse(path), new TextEncoder().encode(val));
      });
  }
  update() {}
  remove() {}
  query() {}
}
