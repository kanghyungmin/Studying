import { Event } from "src/eventsourcing/core/Event";

export class TransferSagaCanceled extends Event{
  constructor(
    public  transferId: string,
    public  accountNo: string,
    
  ) {
    super();
  }
    public getTransferId(): string {
        return this.transferId;
    }

    public setTransferId(transferId: string): void {
        this.transferId = transferId;
    }

    public getFromAccountNo(): string {
        return this.accountNo;
    }

    public setFromAccountNo(accountNo: string): void {
        this.accountNo = accountNo;
    }
}

