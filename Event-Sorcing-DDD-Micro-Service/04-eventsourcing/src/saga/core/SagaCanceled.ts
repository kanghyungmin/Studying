import { Event } from '../../eventsourcing/core/Event';

export class SagaCanceled extends Event {
    // private correlationId: string;
  
    constructor(correlationId: string = '') {
      super();
      this.setCorrelationId(correlationId);
    }
  }