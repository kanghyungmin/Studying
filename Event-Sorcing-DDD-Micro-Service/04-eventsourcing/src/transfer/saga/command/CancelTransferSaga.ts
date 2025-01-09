import { Command } from "src/eventsourcing/core/Command";


export class CancelTransferSaga{
  constructor(public transferId: string) {
  }
public getTransferId(): string {
    return this.transferId;
}

public setTransferId(transferId: string): void {
    this.transferId = transferId;
}
}
