class Common { 
    /** 唯一 根据此更新删除判断 */
    key: string;
    description: string;
    
}
class Template extends Common { 
    /** 文件类型 */
    type: string;
    value: Array<string>;


}

export { Template };