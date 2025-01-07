
import { Event } from "src/eventsourcing/core/Event";


export class AccountClosed extends Event {
    accountNo: string;
    balance: number;
  
    constructor(accountNo?: string, balance?: number) {
      super();
      this.accountNo = accountNo?? null;
      this.balance = balance?? null;
      
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

