import { Command } from "src/eventsourcing/core/Command";


export class CancelTransfer extends Command{
  constructor(public readonly transferId: string) {
    super();
  }
}
