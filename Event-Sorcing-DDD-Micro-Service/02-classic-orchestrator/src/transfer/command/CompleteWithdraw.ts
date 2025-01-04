import { Command } from "src/core/Command";




export class CompleteWithdraw extends Command {

    private transferId : string;

    constructor( transferId : string
    ) {
        super();
        this.transferId = transferId;
    }

    public getTransferId() : string {
        return this.transferId;
    }

    public setTransferId(transferId : string) {
        this.transferId = transferId;
    }
}