import { CodeRegion } from "./CodeRegion";

class PreviewProperty {
    /** 由于使用的是prismjs 为了容易扩展，我们需要动态提供class 除非是固定的语言固定的格式 */
    classes: string = "";
    /** 代码块 */
    codes: Array<string> = [];
}

// 此处的参数配置必须参照 https://prismjs.com/#supported-languages
// 建议key为文件类型, 值为官网中提供的对应样式
const LANGUAGE_DICT: { [k: string]: string } = {
    java: "language-java",
    ts: "language-ts",
    js: "language-js",
    go: "language-go",
    c: "language-c",
    json: "language-json",
    py: "language-py",
    sql: "language-sql",
    vim: "language-vim",
    md: "language-md",
};

class DefaultPreviewPropertyBuilder {
    static newInstance(codeRegion: CodeRegion): PreviewProperty {
        let property = new PreviewProperty();
        property.classes += " " + DefaultPreviewPropertyBuilder.getLanguageClass(codeRegion.begin.type);
        if (!codeRegion.begin.lineNumber || codeRegion.begin.lineNumber) {
            property.classes += " line-numbers";
        }
        property.codes = codeRegion.contents;
        return property;
    }

    /**
     * 获取代码风格class
     * @param codeType 代码类型 一般是文件后缀 需要指定为LANGUAGE_DICT支持的格式
     */
    private static getLanguageClass(codeType: string): string {
        return LANGUAGE_DICT[codeType] || "language-none";
    }
}

export { PreviewProperty, DefaultPreviewPropertyBuilder };
