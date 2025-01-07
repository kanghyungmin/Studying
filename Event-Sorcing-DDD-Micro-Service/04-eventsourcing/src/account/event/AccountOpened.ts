
import { Event } from "src/eventsourcing/core/Event";


export class AccountOpened extends Event {
    accountNo: string;
    balance: number;
  
    constructor(accountNo: string, balance: number) {
      super();
      this.accountNo = accountNo;
      this.balance = balance;
      
    }

    public getAccountNo(): string {
        return this.accountNo;
    }
    public getBalance(): number {
        return this.balance;
    }
    public setAccountNo(accountNo: string) {
        this.accountNo = accountNo;
    }
    public setBalance(balance: number) {
        this.balance = balance;
    }
    
  }

