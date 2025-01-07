import { OnEvent } from "@nestjs/event-emitter";
import { AccountOpened } from "../event/AccountOpened";
import { AccountViewStore } from "./store/AccountViewStore";
import { Injectable } from "@nestjs/common";
import { AccountView } from "./AccountView";
import { Deposited } from "../event/Deposited";
import { Withdrawed } from "../event/Withdrawed";



@Injectable()
export class AccountEventHandler {
  constructor(private readonly accountViewStore: AccountViewStore) {}

  @OnEvent(AccountOpened.name)
  async onAccountOpened(event: AccountOpened): Promise<void> {
    const view : AccountView = new AccountView(
        event.getAccountNo(),
        event.getBalance(),
    )
    await this.accountViewStore.create(view);
  }

  @OnEvent(Deposited.name)
  async onCancelDeposit(event: Deposited): Promise<void> {
    
    if(event.getTransferId() == null){
        const view = await this.accountViewStore.retrieve(event.getAccountNo());
        view.setBalance(view.getBalance() - event.getAmount()) ;
        this.accountViewStore.update(view);
    }
  }

  @OnEvent(Withdrawed.name)
  async onWithDrawed(event: Withdrawed): Promise<void> {
    if(event.getTransferId() == null){
        const view = await this.accountViewStore.retrieve(event.getAccountNo());
        view.setBalance(view.getBalance() - event.getAmount()) ;
        this.accountViewStore.update(view);
    }
  }

//   @OnEvent(TransferCompleted.name)
//   async onTransferCompleted(event: TransferCompleted): Promise<void> {
//     const fromView = await this.accountViewStore.retrieve(event.getFromAccountNo());
//     fromView.setBalance(fromView.getBalance() - event.getAmount());
//     this.accountViewStore.update(fromView);

//     const toView = await this.accountViewStore.retrieve(event.getToAccountNo());
//     toView.setBalance(toView.getBalance() + event.getAmount());
//     this.accountViewStore.update(toView);
//   }
}