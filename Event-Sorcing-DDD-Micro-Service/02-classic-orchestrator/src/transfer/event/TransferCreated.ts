import { Event } from "src/core/Event";


export class TransferCreated extends Event {
    transferId: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
  
    constructor(transferId: string, fromAccount: string, toAccount: string, amount: number) {
      super()
      this.transferId = transferId;
      this.fromAccount = fromAccount;
      this.toAccount = toAccount;
      this.amount = amount;
    }

    public getTransferId() : string {
        return this.transferId;
    }
    public getFromAccount() : string {
        return this.fromAccount;
    }
    public getToAccount() : string {
        return this.toAccount;
    }
    public getAmount() : number {
        return this.amount;
    }
    public setTransferId(transferId : string) {
        this.transferId = transferId;
    }
    public setFromAccount(fromAccount : string) {
        this.fromAccount = fromAccount;
    }
    public setToAccount(toAccount : string) {
        this.toAccount = toAccount;
    }
    public setAmount(amount : number) {
        this.amount = amount;
    }
    
  }
