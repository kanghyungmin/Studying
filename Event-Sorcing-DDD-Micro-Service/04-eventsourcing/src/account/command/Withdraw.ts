import { Command } from "src/eventsourcing/core/Command";



export class Withdraw extends Command {
    private no : string;
    private amount : number;
    private transferId : string;
    constructor(
        no : string,
        amount : number,
        transferId : string
    ) {
        super();
        this.no = no;
        this.amount = amount;
        this.transferId = transferId;
    }
    public getTransferId(): string {
        return this.transferId;
    }
    public setTransferId(transferId: string) {
        this.transferId = transferId;
    }
    public setNo(no: string) {
        this.no = no;
    }
    public setAmount(amount: number) {
        this.amount = amount;
    }
    
    public getNo(): string {
        return this.no;
    }
    public getAmount(): number {
        return this.amount;
    }
}