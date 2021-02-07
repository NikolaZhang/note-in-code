
export class INoteCommand {
    
    /** 命令前缀 */
    readonly prefix: string = "nic";
    category: string;

    /**
     * 获取命令名称 通过统一的前缀拼接当前命令的分类以及当前命令的名字
     * @param: 当前命令的名字
     * @returns: 拼接好的命令名
     */
    protected getCmdName(cmd: string): string {
        if (!cmd) { 
            throw new Error("u must give a cmd name");
        }
        return this.prefix + "." + this.category + "." + cmd;
    }
    
}
