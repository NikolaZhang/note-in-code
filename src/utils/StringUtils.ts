
/**
 * 将文本模板中的标记替换为参数
 * @param mark 标记
 * @param template 文本模板
 * @param args 参数
 */
function formatWithMark(mark: string, template: string, ...args: string[]): string{ 
    args.forEach(element => {
        template = template.replace(mark ? mark : "{}", element);
    });
    return template;
}

/**
 * 将文本模板中的标记替换为参数, 使用默认的标记
 * @param template 文本模板
 * @param args 参数
 */
function format(template: string, ...args: any): string{ 
    return formatWithMark(null, template, args);
}

export { formatWithMark, format };

