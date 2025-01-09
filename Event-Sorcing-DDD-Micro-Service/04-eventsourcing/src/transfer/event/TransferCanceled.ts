import { Event } from "src/eventsourcing/core/Event";


export class TransferCanceled extends Event{
  constructor(public readonly transferId: string) {
    super();
  }
}
