import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { EventSourcedSaga } from 'src/saga/core/EventSourcedSaga';
import { BeginTransferSaga } from './command/BeginTransferSaga';
import { TransferSagaBegan } from './event/TransferSagaBegan';
import { DeposiTransferSaga } from './command/DeposiTransferSaga';
import { TransferSagaDeposited } from './event/TransferSagaDeposited';
import { WithdrawTransferSaga } from './command/WithdrawTransferSaga';
import { TransferSagaWithdrawed } from './event/TransferSagaWithdrawed';
import { CompleteTransferSaga } from './command/CompleteTransferSaga';
import { TransferSagaCompleted } from './event/TransferSagaCompleted';
import { TransferSagaCanceled } from './event/TransferSagaCanceled';
import { CancelTransferSaga } from './command/CancelTransferSaga';


@Injectable()
export class TransferSaga extends EventSourcedSaga {
  private readonly logger = new Logger(TransferSaga.name);

  private transferId: string;
  private toAccountNo: string;
  private deposited = false;
  private withdrawed = false;

  constructor(command: BeginTransferSaga) {
    super();
    if(command.transferId ) {
        this.apply(
            new TransferSagaBegan(
                command.transferId,
                command.fromAccountNo,
                command.toAccountNo,
                command.amount
            )
        )
    }
  }

  public identifier(): string {
    return this.transferId
  }

async onTransferSagaBegan(event: TransferSagaBegan ) {
    this.transferId = event.transferId;
    this.toAccountNo = event.toAccountNo;
    this.logger.log(`Transfer saga started for transfer ID: ${this.transferId}`);
  }

  async depositTransferSaga( command: DeposiTransferSaga) {
    // Apply event
    this.apply(new TransferSagaDeposited());
  }

  
  async onTransferSagaDeposited( event: TransferSagaDeposited) {
      this.deposited = true;
  }

  
  async withdrawTransferSaga(command: WithdrawTransferSaga) {
    // Apply event
    this.apply(new TransferSagaWithdrawed());
  }


  async onTransferSagaWithdrawed( event: TransferSagaWithdrawed) {
      this.withdrawed = true;
  }

  async completeTransferSaga(command: CompleteTransferSaga) {
    // Apply event
    this.apply(new TransferSagaCompleted());
  }

  async onTransferSagaCompleted( event: TransferSagaCompleted) {
      this.setCompleteSaga(true);
  }

  async cancelTransferSaga(command: CancelTransferSaga) {
    this.apply(new TransferSagaCanceled(this.toAccountNo, this.transferId));
  }

  private onTransferSagaCanceled(event: TransferSagaCanceled) {
    this.logger.log(`Transfer saga canceled for transfer ID: ${this.transferId}`);
    this.setCompleteSaga(true);
  }

  completed(): boolean {
    return this.deposited && this.withdrawed;
  }
}
