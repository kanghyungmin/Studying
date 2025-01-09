import { AggregateRoot } from '@nestjs/cqrs';
import { EventSourcedAggregate } from 'src/eventsourcing/core/EventSourcedAggregate';
import { State } from './State';
import { CompleteTransfer } from '../command/CompleteTransfer';
import { TransferCompleted } from '../event/TransferCompleted';
import { TransferCreated } from '../event/TransferCreated';
import { TransferMoney } from '../command/TransferMoney';
import { CancelTransfer } from '../command/CancelTransfer';
import { TransferCanceled } from '../event/TransferCanceled';


export class Transfer extends EventSourcedAggregate {
  transferId: string;
  fromAccountNo: string;
  toAccountNo: string;
  amount: number;
  state: State;

  constructor(command : TransferMoney) {
    super();
    if (command) {
      const event = new TransferCreated(
        command.transferId,
        command.fromAccountNo,
        command.toAccountNo,
        command.amount,
      );
      event.setCorrelationId(command.transferId);

      this.apply(event);
    }
  }

  identifier(): string {
    return this.transferId;
  }

  private onTransferCreated(event: TransferCreated): void {
    this.transferId = event.transferId;
    this.fromAccountNo = event.fromAccountNo;
    this.toAccountNo = event.toAccountNo;
    this.amount = event.amount;
    this.state = State.Unknown;

    this.startSaga();
  }

  completeTransfer(command: CompleteTransfer): void {
    const event = new TransferCompleted(
      command.transferId,
      this.fromAccountNo,
      this.toAccountNo,
      this.amount,
    );
    event.setCorrelationId(command.transferId);

    this.apply(event);
  }

  private onTransferCompleted(event: TransferCompleted): void {
    this.state = State.Succeed;
    this.endSaga();
  }

  cancelTransfer(command: CancelTransfer): void {
    const event = new TransferCanceled(command.transferId);
    this.apply(event);
  }

  private onTransferCanceled(event: TransferCanceled): void {
    this.state = State.Fail;
    this.endSaga();
  }


}
