


export class QueryAccount {

    //
    private no : string;

    constructor(no : string) {
        this.no = no;
    }

    public setNo(no: string) {
        this.no = no;
    }
    public getNo(): string {
        return this.no;
    }
}
