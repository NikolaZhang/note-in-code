/**
 * 将json字符串转换为对象
 * @param json json格式字符串
 * @param o 转换成的目标对象
 * @param T 目标对象类型
 */
function convertJson<T>(json: string, o: T) {
    if (!o) {
        throw new Error("对象必须实例化");
    }
    try {
        let t = JSON.parse(json);
        Object.assign(o, t);
    } catch (error) {
        return o;
    }
}

export { convertJson };
