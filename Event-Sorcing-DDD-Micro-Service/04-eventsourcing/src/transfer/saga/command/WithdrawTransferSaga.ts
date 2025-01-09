import { Command } from "src/eventsourcing/core/Command";


export class WithdrawTransferSaga{
  constructor(public transferId: string) {
  }
    public getTransferId(): string {
        return this.transferId;
    }

    public setTransferId(transferId: string): void {
        this.transferId = transferId;
    }
}
