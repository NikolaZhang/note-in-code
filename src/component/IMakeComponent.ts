import * as vscode from 'vscode';

/**
 * @author zhangxu
 */
export interface IMakeComponent {
    /**
     * 命令注册
     * 为了方便在extension.ts文件中注册组件, 
     * 只要子类实现该方法并被调用即可获取到一个elements,
     * @param context: 将elements注入到上下文中
     */
    apply(context: vscode.ExtensionContext): void;
}