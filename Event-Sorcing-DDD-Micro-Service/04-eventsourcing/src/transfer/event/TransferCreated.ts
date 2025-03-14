import { Event } from "src/eventsourcing/core/Event";


export class TransferCreated extends Event{
  constructor(
    public readonly transferId: string,
    public readonly fromAccountNo: string,
    public readonly toAccountNo: string,
    public readonly amount: number,
) {
    super();
  }
}
