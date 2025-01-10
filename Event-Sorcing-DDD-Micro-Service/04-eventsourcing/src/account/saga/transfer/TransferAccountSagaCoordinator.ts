import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccountService } from '../../service/account.service';
import { Gateway } from 'src/eventsourcing/core/Gateway';
import { TransferSagaBegan } from 'src/transfer/saga/event/TransferSagaBegan';
import { Deposit } from 'src/account/command/Deposit';
import { Withdraw } from 'src/account/command/Withdraw';
import { CancelDeposit } from 'src/account/command/CancelDeposit';
import { TransferSagaCanceled } from 'src/transfer/saga/event/TransferSagaCanceled';

@Injectable()
export class TransferAccountSagaCoordinator {
  constructor(
    private readonly accountService: AccountService,
    private readonly gateway : Gateway
) {}

  @OnEvent(TransferSagaBegan.name)
  async onDeposit(event: TransferSagaBegan): Promise<void> {
    try {
      const command = new Deposit(event.toAccountNo, event.amount, event.transferId);
      await this.accountService.deposit(command);
    } catch (error) {
      console.error('Error during deposit:', error);
      // Handle exception as needed
    }
  }

  @OnEvent(TransferSagaBegan.name)
  async onWithdraw(event: TransferSagaBegan): Promise<void> {
    try {
      const command = new Withdraw(event.fromAccountNo, event.amount, event.transferId);
      await this.accountService.withdraw(command);
    } catch (error) {
      console.error('Error during withdraw:', error);
      // Handle exception as needed
    }
  }

  @OnEvent(TransferSagaCanceled.name)
  async on(event: TransferSagaCanceled): Promise<void> {
    try {
      const command = new CancelDeposit(event.accountNo, event.transferId);
      await this.accountService.cancelDeposit(command);
    } catch (error) {
      console.error('Error during cancel deposit:', error);
      // Handle exception as needed
    }
  }
}
