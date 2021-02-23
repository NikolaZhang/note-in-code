interface ICheck {
    /** 字段校验 */
    check(): string;
}
class Common {
    /** 唯一 根据此更新删除判断 */
    key: string;
    description: string;
}

/**
 * 模板配置对应的实体。
 * 进行字符串解析时， 我们通过匹配字符串的开头判断这个是否是note in code的配置
 * 我们匹配到模板的开头标记后，就会去解析模板的配置信息
 *
 */
class TemplateEntity extends Common implements ICheck {
    /** 文件类型 */
    type: string;
    beginFlag: string;

    public check(): string {
        if (!this.key) {
            return "唯一键[key]一定要给我哦~";
        }
        if (!this.type) {
            return "文件类型参数[type]一定要给我哦~";
        }
        if (!this.beginFlag) {
            return "模板開始标记[beginFlag]一定要给我哦~";
        }
        return "";
    }
}

/**
 * 最大扫描行数, 如果没有指定代码的结尾处, 则扫描到默认值处结束。
 * 注意按照代码区块扫描, 如果方法没有结束则最多扫到方法结束位置
 * 如果代码行数为400则会扫描400行
 */
const DEFAULT_MAX_SCAN_LINE = 10;

class BeginEntity {
    /** 代码注释的标题 */
    title: string;
    /** 代码语言类型, 默认情况下我们直接使用当前文件后缀 */
    type: string;
    /** 当前注释代码的类型标记 跟据该标记进行代码的分类 */
    tag: Array<string>;
    /** 当前代码的简单描述 */
    description: string;
    /** 注释代码的开始位置, 0表示当前注释的位置, 默认从下一行开始 */
    codeBegin: number;
    /** 注释代码的结束相对位置， 默认到区域结束位置 */
    codeEnd: number;
    /** 强制扫描， 适用于导出。 如果不指定该参数我们会使用省略代替长代码 */
    forceScan: boolean;
    /** 相关方法, 注意考虑到方法重载， 我们需要你提供参数即原始方法定义的方法名+参数 */
    methods: Array<string> = [];

    /** 是否展示行号 */
    lineNumber: boolean = true;
    /** 强制对齐, 当代码中每行出现空格 是否将相同长度的空格去除 */
    forceTrim: boolean = false;
}

export { TemplateEntity, BeginEntity, DEFAULT_MAX_SCAN_LINE };
