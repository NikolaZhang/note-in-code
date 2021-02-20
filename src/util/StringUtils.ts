import * as vscode from "vscode";

/**
 * 将文本模板中的标记替换为参数
 * @param mark 标记
 * @param template 文本模板
 * @param args 参数
 */
function formatWithMark(mark: string, template: string, ...args: string[]): string {
    args.forEach((element) => {
        template = template.replace(mark ? mark : "{}", element);
    });
    return template;
}

/**
 * 将文本模板中的标记替换为参数, 使用默认的标记
 * @param template 文本模板
 * @param args 参数
 */
function format(template: string, ...args: any): string {
    return formatWithMark(null, template, args);
}

/**
 * 移除文本中出现的相同空前缀
 * @param multiLine 含有多行的文本
 * @param symbol 换行符标记
 */
function formatPrefix(multiLine: string, symbol: string = "\n"): string{
    let lines = multiLine.split(symbol);
    let minSpaceCount = Number.MAX_VALUE;
    lines.forEach((item) => {
        // 对于空行直接跳过不进行处理 否则tempSpaceCount为0就无法移除前缀了
        if (item.length === 0) { 
            return;
        }
        let tempSpaceCount = 0;
        // 对于既有空格又有\t的缩进, 还是先进行代码的格式化吧 (●'◡'●)
        for (let i = 0; i < item.length; i++) {
            if (" " === item.charAt(i) || "\t" === item.charAt(i)) {
                ++tempSpaceCount;
                if (tempSpaceCount >= minSpaceCount) {
                    break;
                }
            } else {
                // 非空格和tab符号则认为是到了代码区域(html以<作为开始)
                if (tempSpaceCount < minSpaceCount) {
                    minSpaceCount = tempSpaceCount;
                }
                break;
            }
        }
    });
    let tab = "\t".repeat(minSpaceCount);
    let space = " ".repeat(minSpaceCount);
    lines.forEach((item, index) => {
        if (item.startsWith(tab)) {
            lines[index] = item.replace(tab, "");
        }
        if (item.startsWith(space)) {
            lines[index] = item.replace(space, "");
        }
    });
    return lines.join(symbol);
}

export { formatWithMark, format, formatPrefix };
