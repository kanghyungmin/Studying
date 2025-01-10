import { Injectable } from '@nestjs/common';
import { AggregateStore } from 'src/eventsourcing/store/AggregateStore';
import { v4 as uuidv4 } from 'uuid';
import { Transfer } from '../aggregate/Transfer';
import { TransferMoney } from '../command/TransferMoney';
import { QueryTransfer } from '../query/QueryTransfer';
import { CompleteTransfer } from '../command/CompleteTransfer';
import { CancelTransfer } from '../command/CancelTransfer';
import { Gateway } from 'src/eventsourcing/core/Gateway';
import { TransferCreated } from '../event/TransferCreated';

@Injectable()
export class TransferService {
  constructor(
    private readonly aggregateStore: AggregateStore<Transfer>,
    private readonly gateway : Gateway,
  ) {}

  async transferMoney(command: TransferMoney): Promise<string> {
    const newTransferId = uuidv4().split('-')[0];
    command.transferId = newTransferId;
    const transfer = new Transfer(command);
    
    await this.aggregateStore.save(transfer);
    this.gateway.publishEvnetOnlocal<TransferCreated>(new TransferCreated(
      command.transferId,
      command.fromAccountNo,
      command.toAccountNo,
      command.amount,
    ));
    

    return newTransferId;
  }

  async queryTransfer(query: QueryTransfer): Promise<Transfer> {
    return await this.aggregateStore.load(query.transferId);
  }

  async complete(command: CompleteTransfer): Promise<void> {
    const transfer = await this.aggregateStore.load(command.transferId);
    transfer.completeTransfer(command);
    await this.aggregateStore.save(transfer);
  }

  async cancel(command: CancelTransfer): Promise<void> {
    const transfer = await this.aggregateStore.load(command.transferId);
    transfer.cancelTransfer(command);
    await this.aggregateStore.save(transfer);
  }
}
