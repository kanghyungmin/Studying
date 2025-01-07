import { Command } from "src/eventsourcing/core/Command";


  
export class CloseAccount extends Command {
    private no : string;
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