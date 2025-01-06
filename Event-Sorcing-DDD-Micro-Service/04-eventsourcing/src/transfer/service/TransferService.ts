import { Injectable, Logger } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { TransferStore } from '../store/TransferStore';
import { Gateway } from 'src/core/Gateway';
import { TransferMoney } from '../command/TransferMoney';
import { Transfer } from '../aggregate/Transfer';
import { TransferCreated } from '../event/TransferCreated';
import { QueryTransfer } from '../query/QueryTransfer';
import { CancelTransfer } from '../command/CancelTransfer';
import { CompleteDeposit } from '../command/CompleteDeposit';
import { CompleteWithdraw } from '../command/CompleteWithdraw';
import { TransferCanceled } from '../event/TransferCanceled';

@Injectable()
export class TransferService {
  private readonly logger = new Logger(TransferService.name);

  constructor(
    private readonly transferStore: TransferStore,
    private readonly gateway: Gateway,
  ) {}

  async transfer(command: TransferMoney): Promise<string> {
    const newId = uuidv4().split('-')[0];
    command.transferId = newId;

    const transfer = new Transfer(command);
    await this.transferStore.create(transfer);

    const event = new TransferCreated(
      newId,
      command.fromAccount,
      command.toAccount,
      command.amount,
    );
    console.log("1")
    this.gateway.publishEvnetOnlocal(event);
    console.log("2")

    return newId;
  }

  async query(query: QueryTransfer): Promise<Transfer> {
    return await this.transferStore.retrieve(query.getTransferId());
  }

  async completeDeposit(command: CompleteDeposit): Promise<void> {
    this.logger.log('TransferService.completeDeposit called');
    const transfer = await this.transferStore.retrieve(command.getTransferId());
    transfer.completeDeposit(command);
    await this.transferStore.update(transfer);
  }

  async completeWithdraw(command: CompleteWithdraw): Promise<void> {
    this.logger.log('TransferService.completeWithdraw called');
    const transfer = await this.transferStore.retrieve(command.getTransferId());
    transfer.completeWithdraw(command);
    await this.transferStore.update(transfer);
  }

  async cancel(command: CancelTransfer): Promise<void> {
    this.logger.log('TransferService.cancel called');
    const transfer = await this.transferStore.retrieve(command.getTransferId());
    transfer.cancel(command);
    await this.transferStore.update(transfer);

    const event = new TransferCanceled(
      transfer.transferId,
      transfer.fromAccount,
      transfer.toAccount,
      transfer.amount,
    );
    await this.gateway.publishEvnetOnlocal(event);
  }
}
