interface ICheck {
    /** 字段校验 */
    check(): string;
}
class Common {
    /** 唯一 根据此更新删除判断 */
    key: string;
    description: string;

    constructor(key: string, description: string) {
        this.key = key;
        this.description = description;
    }
}
class Template extends Common implements ICheck {
    /** 文件类型 */
    type: string;
    value: Array<string> | string;

    constructor(
        key: string,
        description: string,
        type: string,
        value: Array<string> | string
    ) {
        super(key, description);
        this.type = type;
        this.value = value;
    }

    public check(): string {
        if (!this.key) {
            return "唯一键[key]一定要给我哦~";
        }
        if (!this.type) {
            return "文件类型参数[type]一定要给我哦~";
        }
        if (!this.value) {
            return "模板内容[value]一定要给我哦~";
        }
        return "";
    }
}

export { Template };
