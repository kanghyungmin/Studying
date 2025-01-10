import { Event } from "src/eventsourcing/core/Event";

export class TransferSagaDeposited extends Event{
  constructor() {
    super();
    console.log('TransferSagaDeposited')
  }
}

