import { Event } from '../../eventsourcing/core/Event';

export class SagaCompleted extends Event {
    // private correlationId: string;
  
    constructor(correlationId: string = '') {
      super();
      this.setCorrelationId(correlationId);
    }
  }