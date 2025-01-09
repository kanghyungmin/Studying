import { Command } from "src/eventsourcing/core/Command";


export class CompleteTransfer extends Command{
  constructor(public readonly transferId: string) {
    super();
  }
}
