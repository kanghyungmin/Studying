import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, Timeout } from '@nestjs/schedule';
import { TransferService } from '../service/transfer.service';
import { SagaStore } from 'src/saga/store/saga.store';
import { EventSourcedSaga } from 'src/saga/core/EventSourcedSaga';
import { TransferCreated } from '../event/TransferCreated';
import { BeginTransferSaga } from './command/BeginTransferSaga';
import { TransferSaga } from './TransferSaga';
import { SagaTimeout } from 'src/saga/time/SagaTimeout';
import { SagaTimeExpired } from 'src/saga/time/SagaTimeExpired';
import { CancelTransferSaga } from './command/CancelTransferSaga';
import { CancelTransfer } from '../command/CancelTransfer';
import { WithdrawFailed } from 'src/account/event/WithdrawFailed';
import { Withdrawed } from 'src/account/event/Withdrawed';
import { WithdrawTransferSaga } from './command/WithdrawTransferSaga';
import { CompleteTransfer } from '../command/CompleteTransfer';
import { Deposited } from 'src/account/event/Deposited';
import { DeposiTransferSaga } from './command/DeposiTransferSaga';
import { TransferCompleted } from '../event/TransferCompleted';
import { CompleteTransferSaga } from './command/CompleteTransferSaga';
import { TransferCanceled } from '../event/TransferCanceled';


@Injectable()
export class TransferSagaCoordinator implements OnModuleInit {
  private readonly logger = new Logger(TransferSagaCoordinator.name);
  private readonly SAGA_NAME = 'Transfer';

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly transferService: TransferService,
    private readonly sagaStore: SagaStore<TransferSaga>,
  ) {}

  onModuleInit() {
    this.logger.log('TransferSagaCoordinator initialized');
  }

  @OnEvent(TransferCreated.name)
  async onTransferCreated(event: TransferCreated) {
    const command = new BeginTransferSaga(
      event.transferId,
      event.fromAccountNo,
      event.toAccountNo,
      event.amount,
    );

    const saga = new TransferSaga(command);
    await this.sagaStore.save(saga);

    console.log("before scheduleSagaTimeout");
    await this.scheduleSagaTimeout(event.transferId);
    console.log("after scheduleSagaTimeout");
  }

  // Schedule timeout task
  @Timeout(5000)
  async scheduleSagaTimeout(transferId: string) {
    console.log("in scheduleSagaTimeout");
    const sagaTimeoutEvent = new SagaTimeout(transferId, this.SAGA_NAME,this.eventEmitter);
    sagaTimeoutEvent.run();
  }

  // Event Listener: SagaTimeExpired
  @OnEvent(SagaTimeExpired.name)
  async onSagaTimeExpired(event: SagaTimeExpired) {
    if (event.sagaType !== this.SAGA_NAME) return;

    const saga: TransferSaga = await this.sagaStore.load(event.correlationId);

    if (!saga.isCompleteSaga()) {
      const command  = new CancelTransferSaga(event.correlationId);
      await saga.cancelTransferSaga(command);
      await this.sagaStore.save(saga);

      if (saga.completed()) {
        await this.transferService.cancel(new CancelTransfer(event.correlationId));
      }
    }
  }

  // Event Listener: WithdrawFailed
  @OnEvent(WithdrawFailed.name)
  async onWithdrawFailed(event: WithdrawFailed) {
    if (!event.transferId) return;

    const saga = await this.sagaStore.load(event.transferId);

    if (!saga.isCompleteSaga()) {
      const command = new CancelTransferSaga(event.transferId);
      await saga.cancelTransferSaga(command);
      await this.sagaStore.save(saga);

      if (saga.completed()) {
        await this.transferService.cancel(new CancelTransfer(event.transferId));
      }
    }
  }

  // Event Listener: Withdrawed
  @OnEvent(Withdrawed.name)
  async onWithdrawed(event: Withdrawed) {
    if (!event.transferId) return;

    const saga = await this.sagaStore.load(event.transferId);

    if (!saga.isCompleteSaga()) {
      const command = new WithdrawTransferSaga(event.transferId);
      await saga.withdrawTransferSaga(command);
      await this.sagaStore.save(saga);

      if (saga.completed()) {
        await this.transferService.complete(new CompleteTransfer(event.transferId));
      }
    }
  }

  // Event Listener: Deposited
  @OnEvent(Deposited.name)
  async onDeposited(event: Deposited) {
    if (!event.transferId) return;

    const saga = await this.sagaStore.load(event.transferId);

    if (!saga.isCompleteSaga()) {
      const command = new DeposiTransferSaga(event.transferId);
      await saga.depositTransferSaga(command);
      await this.sagaStore.save(saga);

      if (saga.completed()) {
        await this.transferService.complete(new CompleteTransfer(event.transferId));
      }
    }
  }

  // Event Listener: TransferCompleted
  @OnEvent(TransferCompleted.name)
  async onTransferCompleted(event: TransferCompleted) {
    const saga = await this.sagaStore.load(event.transferId);
    const command = new CompleteTransferSaga(event.transferId);
    await saga.completeTransferSaga(command);
    await this.sagaStore.save(saga);
  }

  // Event Listener: TransferCanceled
  @OnEvent(TransferCanceled.name)
  async onTransferCanceled(event: TransferCanceled) {
    const saga = await this.sagaStore.load(event.transferId);
    const command = new CancelTransferSaga(event.transferId);
    await saga.cancelTransferSaga(command);
    await this.sagaStore.save(saga);
  }
}
