import { CancelDeposit } from "../command/CancelDeposit";
import { CreateAccount } from "../command/CreateAccount";
import { Deposit } from "../command/Deposit";
import { Withdraw } from "../command/Withdraw";

// account.entity.ts
export class Account {
    no: string;
    balance: number;
    private version: number;
  
    constructor(command : CreateAccount | null, aa :  {
        no,
        balance,
        version
     } | null) {
      if(command) 
        {
            this.no = command.no
            this.balance = 0;
        }
        else
            {
                this.no = aa.no;
                this.balance = aa.balance;
                this.version = aa.version;
            }
    }
     
  
    deposit( command : Deposit) {
      this.balance += command.getAmount();
    }
  
    cancelDeposit(command : CancelDeposit) {
      this.balance -= command.getAmount();
    }
  
    withdraw(command : Withdraw) {
      if (this.balance < command.getAmount()) {
        throw new Error('Not enough balance');
      }
      this.balance -= command.getAmount();
    }
  
    getVersion(): number {
      return this.version;
    }
  
    setVersion(version: number) {
      this.version = version;
    }

    getNo(): string {
      return this.no;
    }
    getBalance(): number {
        return this.balance;
    }
  }
  