import * as vscode from "vscode";

export abstract class BaseNoteCommand {
    /** 命令前缀 */
    readonly prefix: string = "nic";

    /**
     * 获取分类
     * @returns: 分类字符串
     */
    protected abstract getCategory(): string;

    /**
     * 获取命令名称 通过统一的前缀拼接当前命令的分类以及当前命令的名字
     * @param: 当前命令的名字
     * @returns: 拼接好的命令名
     */
    protected getCmdName(cmd: string): string {
        if (!cmd) {
            throw new Error("u must give a cmd name");
        }
        let cmdName: string =
            this.prefix + "." + this.getCategory() + "." + cmd;
        console.log(cmdName);
        return cmdName;
    }

    /**
     * 校验配置是否存在
     * @param: 配置
     * @returns: 是否存在
     */
    protected check(config: string): boolean {
        let configs = vscode.workspace.getConfiguration().get<Array<any>>(config);
        if (configs && configs.length !== 0) {
            return true;
        } else {
            return false;
        }
    }
}
