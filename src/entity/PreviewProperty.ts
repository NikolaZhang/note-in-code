class PreviewProperty {
    /** 由于使用的是prismjs 为了容易扩展，我们需要动态提供class 除非是固定的语言固定的格式 */
    classes: string = "";
    /** 代码块 */
    codes: string = "";
}

class DefaultPreviewPropertyBuilder {
    newInstance(options: {
        lineNumber: boolean;
        codeType: string;
        codes: string;
    }): PreviewProperty {
        // todo zx 完善属性配置生成方法
        let property = new PreviewProperty();

        if (options.lineNumber) {
            property.classes += " linenumber";
        }
        return property;
    }
}

export { PreviewProperty };
