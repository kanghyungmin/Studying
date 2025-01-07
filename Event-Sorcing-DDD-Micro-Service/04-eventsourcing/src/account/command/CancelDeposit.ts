import { Command } from "src/eventsourcing/core/Command";


  
export class CancelDeposit extends Command {
    private no : string;
    private transferId : string | null;
    constructor(
        no : string,
        transferId : string = null
    ) {
        super();
        this.no = no;

        this.transferId = transferId;
    }
    
    public setNo(no: string) {
        this.no = no;
    }
    public setTransferId(transferId: string) {
        this.transferId = transferId;
    }

    public getNo(): string {
        return this.no;
    }
    public getTransferId(): string {
        return this.transferId;
    }
}