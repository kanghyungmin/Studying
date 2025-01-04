// listeners/user-created.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Deposited } from 'src/account/event/Deposited';



@Injectable()
export class TransferOrchestrator {


  @OnEvent(Deposited.name)
  async handleDeposited(event: Deposited) {
  await new Promise(resolve => setTimeout(resolve, 2000)); //비동기 테스트
    console.log('User created', event);
  }
}


// import { Injectable } from '@nestjs/common';


// @Injectable()
// export class TransferOrchestrator {
//   constructor(
//     ㅔ
//   ) {}

//   @EventsHandler(TransferCreatedEvent)
//   async handleTransferCreated(event: TransferCreatedEvent): Promise<void> {
//     const depositCommand = new DepositCommand(event.toAccount, event.amount, event.transferId);
//     await this.commandBus.execute(depositCommand);
//   }

//   @EventsHandler(DepositedEvent)
//   async handleDeposited(event: DepositedEvent): Promise<void> {
//     if (event.transferId) {
//       const completeDepositCommand = new CompleteDepositCommand(event.transferId);
//       await this.commandBus.execute(completeDepositCommand);

//       const transfer: Transfer = await this.queryBus.execute(new QueryTransferQuery(event.transferId));
//       const withdrawCommand = new WithdrawCommand(transfer.fromAccount, event.amount, event.transferId);
//       await this.commandBus.execute(withdrawCommand);
//     }
//   }

//   @EventsHandler(WithdrawedEvent)
//   async handleWithdrawed(event: WithdrawedEvent): Promise<void> {
//     if (event.transferId) {
//       const completeWithdrawCommand = new CompleteWithdrawCommand(event.transferId);
//       await this.commandBus.execute(completeWithdrawCommand);
//     }
//   }

//   @EventsHandler(WithdrawFailedEvent)
//   async handleWithdrawFailed(event: WithdrawFailedEvent): Promise<void> {
//     if (event.transferId) {
//       const cancelTransferCommand = new CancelTransferCommand(event.transferId);
//       await this.commandBus.execute(cancelTransferCommand);
//     }
//   }

//   @EventsHandler(TransferCanceledEvent)
//   async handleTransferCanceled(event: TransferCanceledEvent): Promise<void> {
//     const cancelDepositCommand = new CancelDepositCommand(event.toAccount, event.amount, event.transferId);
//     await this.commandBus.execute(cancelDepositCommand);
//   }
// }
