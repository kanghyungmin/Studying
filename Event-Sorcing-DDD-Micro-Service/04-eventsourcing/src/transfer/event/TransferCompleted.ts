import { Event } from "src/eventsourcing/core/Event";


export class TransferCompleted extends Event{
  constructor(
    public readonly transferId: string,
    public readonly fromAccountNo: string,
    public readonly toAccountNo: string,
    public readonly amount: number,
) {
    super();
  }
}
