import { Injectable } from '@nestjs/common';
import { AggregateStore } from 'src/eventsourcing/store/AggregateStore';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../aggregate/Account';
import { AggregateEventStore } from 'src/eventsourcing/store/AggregateEventStore';
import { OpenAccount } from '../command/OpenAccount';
import { QueryAccount } from '../query/QueryAccount';
import { Deposit } from '../command/Deposit';
import { CancelDeposit } from '../command/CancelDeposit';
import { Withdraw } from '../command/Withdraw';
import { CloseAccount } from '../command/CloseAccount';


@Injectable()
export class AccountService {
  constructor(
    private readonly aggregateStore: AggregateStore<Account>,
    private readonly aggregateEventStore: AggregateEventStore,
  ) {}

  async openAccount(command: OpenAccount): Promise<string> {
    const newAccountNo = uuidv4().split('-')[0];
    command.setNo(newAccountNo);

    const account = new Account(command);
    await this.aggregateStore.save(account);

    return newAccountNo;
  }

  async queryAccount(query: QueryAccount): Promise<Account> {
    return await this.aggregateStore.load(query.getNo());
  }

  async deposit(command: Deposit): Promise<void> {
    const account = await this.aggregateStore.load(command.getNo());
    account.deposit(command);
    await this.aggregateStore.save(account);
  }

  async cancelDeposit(command: CancelDeposit): Promise<void> {
    const account = await this.aggregateStore.load(command.getNo());
    account.cancelDeposit(command);
    await this.aggregateStore.save(account);

    this.aggregateEventStore.markDelete(command.getTransferId());
  }

  async withdraw(command: Withdraw): Promise<void> {
    const account = await this.aggregateStore.load(command.getNo());
    try {
      account.withdraw(command);
      await this.aggregateStore.save(account);
    } catch (e) {
      throw e;
    }
  }

  async close(command: CloseAccount): Promise<void> {
    const account = await this.aggregateStore.load(command.getNo());
    account.close(command);
    await this.aggregateStore.save(account);
  }
}