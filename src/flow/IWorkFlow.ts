interface IWorkFlow {
    name: string;

    apply(): Promise<any>;
}