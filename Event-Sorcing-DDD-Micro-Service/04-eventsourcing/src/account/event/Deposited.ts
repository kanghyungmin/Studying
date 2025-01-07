
import { Event } from "src/eventsourcing/core/Event";


export class Deposited extends Event {
    accountNo: string;
    amount: number;
    transferId: string;
  
    constructor(accountNo: string, amount: number, transferId?: string) {
      super();
      this.accountNo = accountNo;
      this.amount = amount;
      this.transferId = transferId
    }

    public getAccountNo(): string {
        return this.accountNo;
    }
    public getAmount(): number {
        return this.amount;
    }
    public getTransferId(): string {
        return this.transferId;
    }
    public setAccountNo(accountNo: string) {
        this.accountNo = accountNo;
    }
    public setAmount(amount: number) {
        this.amount = amount;
    }
    public setTransferId(transferId: string) {
        this.transferId = transferId;
    }
    
  }

