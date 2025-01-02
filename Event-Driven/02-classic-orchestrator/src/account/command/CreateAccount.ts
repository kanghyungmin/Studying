import { Command } from "src/core/Command";



export class CreateAccount extends Command {
    public no : string;
    constructor(
        no : string,
    ) {
        super();
        this.no = no;
    }


    public setNo(no: string) {
        this.no = no;
    }
    public getNo(): string {
        return this.no;
    }

}