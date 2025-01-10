import { EventSourcedAggregate } from "src/eventsourcing/core/EventSourcedAggregate";
import { CancelDeposit } from "../command/CancelDeposit";
import { CloseAccount } from "../command/CloseAccount";

import { Deposit } from "../command/Deposit";
import { Withdraw } from "../command/Withdraw";

// account.entity.ts
import { EventEmitter2 } from 'eventemitter2';
import { OpenAccount } from "../command/OpenAccount";
import { AccountOpened } from "../event/AccountOpened";
import { Deposited } from "../event/Deposited";
import { WithdrawFailed } from "../event/WithdrawFailed";
import { Withdrawed } from "../event/Withdrawed";
import { DepositCanceled } from "../event/DepositCanceled";
import { AccountClosed } from "../event/AccountClosed";
import { Gateway } from "src/eventsourcing/core/Gateway";


export class Account extends EventSourcedAggregate {
    no: string;
    balance: number;
  
    constructor(
      command?: OpenAccount,
      ) {
      super();
      if(command) {
          this.apply(new AccountOpened(command.no, 0));
      }
    }
     
    identifier(): string {
      return this.no;
    }

    private onAccountOpened(event: AccountOpened): void {
      this.no = event.accountNo;
      this.balance = event.balance;
    }
  
    deposit(command: Deposit): void {
      const event = new Deposited(command.getNo(), command.getAmount(), command.getTransferId());
      event.setCorrelationId(command.getTransferId());
      this.apply(event);
    }
  
    private onDeposited(event: Deposited): void {
      this.balance += event.amount;

      //
      // this.gateway.publishEvnetOnlocal(event);
    }
  
    withdraw(command: Withdraw): void {
      if (this.balance < command.getAmount()) {
        const event = new WithdrawFailed(this.balance, command.getAmount(), command.getTransferId());
        event.setCorrelationId(command.getTransferId());
        this.apply(event);
        throw new Error();
      }
  
      const event = new Withdrawed(command.getNo(), command.getAmount(), command.getTransferId());
      event.setCorrelationId(command.getTransferId());
      this.apply(event);
    }
  
    private onWithdrawFailed(event: WithdrawFailed): void {
      // Handle withdraw failure logic (if needed)
    }
  
    private onWithdrawed(event: Withdrawed): void {
      this.balance -= event.amount;
    }
  
    cancelDeposit(command: CancelDeposit): void {
      const event = new DepositCanceled();
      event.setCorrelationId(command.getTransferId());
      this.apply(event);
    }
  
    private onDepositCanceled(event: DepositCanceled): void {
      // Handle deposit cancellation logic (if needed)
    }
  
    close(command: CloseAccount): void {
      if (this.balance > 0) {
        throw new Error();
      }
  
      const event = new AccountClosed();
      this.apply(event);
    }
  
    private onAccountClosed(event: AccountClosed): void {
      this.markDeleted()
    }
  }
  