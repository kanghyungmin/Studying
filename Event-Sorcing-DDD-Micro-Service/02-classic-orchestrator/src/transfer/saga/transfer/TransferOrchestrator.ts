// listeners/user-created.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CancelDeposit } from 'src/account/command/CancelDeposit';
import { Deposit } from 'src/account/command/Deposit';
import { Withdraw } from 'src/account/command/Withdraw';
import { Deposited } from 'src/account/event/Deposited';
import { Withdrawed } from 'src/account/event/Withdrawed';
import { WithdrawFailed } from 'src/account/event/WithdrawFailed';
import { Gateway } from 'src/core/Gateway';
import { CancelTransfer } from 'src/transfer/command/CancelTransfer';
import { CompleteDeposit } from 'src/transfer/command/CompleteDeposit';
import { CompleteWithdraw } from 'src/transfer/command/CompleteWithdraw';
import { TransferCanceled } from 'src/transfer/event/TransferCanceled';
import { TransferCreated } from 'src/transfer/event/TransferCreated';
import { QueryTransfer } from 'src/transfer/query/QueryTransfer';
import { TransferService } from 'src/transfer/service/TransferService';




@Injectable()
export class TransferOrchestrator {

  constructor(
    private readonly transferSVC : TransferService,
    private readonly gateway : Gateway
  ) {}

  @OnEvent(TransferCreated.name) 
  async handleTransferCreated(event: TransferCreated) {
    
    const depositCommand = new Deposit(event.toAccount, event.amount, event.transferId);
    await this.gateway.sendCommand(depositCommand);
  }

  @OnEvent(Deposited.name)
  async handleDeposited(event: Deposited) {
  await new Promise(resolve => setTimeout(resolve, 2000)); //비동기 테스트
    if (event.transferId) {
      const completeDepositCommand = new CompleteDeposit(event.transferId);
      await this.transferSVC.completeDeposit(completeDepositCommand);

      const query = new QueryTransfer(event.transferId);
      const transfer = await this.transferSVC.query(query);

      const withdrawCommand = new Withdraw(transfer.fromAccount, event.amount, event.transferId);

      this.gateway.sendCommand(withdrawCommand);

    }
  }
  @OnEvent(Withdrawed.name)
  async handleWithdrawed(event: Withdrawed) {
    if (event.transferId) {
      const completeWithdrawCommand = new CompleteWithdraw(event.transferId);
      await this.transferSVC.completeWithdraw(completeWithdrawCommand);
      }
    }

  @OnEvent(WithdrawFailed.name)
  async handleWithdrawFailed(event: WithdrawFailed) {
    if (event.transferId) {
      const command = new CancelTransfer(event.transferId);
      await this.transferSVC.cancel(command);
    }
  }

  @OnEvent(TransferCanceled.name)
  async handleTransferCanceled(event: TransferCanceled) {
    const cancelDepositCommand = new CancelDeposit(
      event.getToAccount(),
      event.getAmount(),
      event.getTransferId()
    );
    await this.gateway.sendCommand(cancelDepositCommand);
    console.log(`handleTransferCanceled`)
  }
}