import { Event } from "src/eventsourcing/core/Event";

export class WithdrawFailed extends Event {
    balance: number;
    amount: number;
    transferId: string;
  
    constructor(balance: number, amount: number, transferId: string) {
      super();
      this.balance = balance;
      this.amount = amount;
      this.transferId = transferId;
    }

    public getBalance(): number {
        return this.balance;
    }
    public getAmount(): number {
        return this.amount;
    }
    public getTransferId(): string {
        return this.transferId;
    }
    public setBalance(balance: number) {
        this.balance = balance;
    }
    public setAmount(amount: number) {
        this.amount = amount;
    }
    public setTransferId(transferId: string) {
        this.transferId = transferId;
    }
    
  }