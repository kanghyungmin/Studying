import { Injectable } from '@nestjs/common';
import { AccountStore } from '../store/AccountStore';
import { Gateway } from 'src/core/Gateway';
import { CreateAccount } from '../command/CreateAccount';
import { Account } from '../aggregate/Account';
import { QueryAccount } from '../query/QueryAccount';
import { Deposit } from '../command/Deposit';
import { Withdrawed } from '../event/Withdrawed';
import { Withdraw } from '../command/Withdraw';
import { CancelDeposit } from '../command/CancelDeposit';
import { Deposited } from '../event/Deposited';
import { WithdrawFailed } from '../event/WithdrawFailed';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountStore: AccountStore,
    private readonly gateway: Gateway,
  ) {}

  async createAccount(command: CreateAccount): Promise<string> {
    const newNo = this.generateUniqueNo();
    command.no = newNo;
    const account = new Account(command, null);
    await this.accountStore.create(account);
    return newNo;
  }

  async queryAccount(query: QueryAccount): Promise<Account> {
    return await this.accountStore.retrieve(query.getNo());
  }

  async deposit(command: Deposit): Promise<void> {
    const account = await this.accountStore.retrieve(command.getNo());
    account.deposit(command);
    await this.accountStore.update(account);

    if (command.getTransferId()) {
      this.gateway.publishEvent(new Deposited(command.getNo(), command.getAmount(), command.getTransferId()));
    }
  }

  async cancelDeposit(command: CancelDeposit): Promise<void> {
    const account = await this.accountStore.retrieve(command.getNo());
    account.cancelDeposit(command);
    await this.accountStore.update(account);
  }

  async withdraw(command: Withdraw): Promise<void> {
    const account = await this.accountStore.retrieve(command.getNo());

    try {
      account.withdraw(command);
      await this.accountStore.update(account);

      if (command.getTransferId()) {
        this.gateway.publishEvent(new Withdrawed(command.getNo(), command.getAmount(), command.getTransferId()));
      }
    } catch (e) {
        this.gateway.publishEvent(new WithdrawFailed(command.getTransferId()));
        throw e;
    }
  }

  private generateUniqueNo(): string {
    return Math.random().toString(36).substr(2, 9); // Simple unique number generation
  }
}
