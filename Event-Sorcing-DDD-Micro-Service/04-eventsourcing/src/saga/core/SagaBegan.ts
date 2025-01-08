import { Event } from '../../eventsourcing/core/Event';

export class SagaBegan extends Event {
    // private correlationId: string;
  
    constructor(correlationId: string = '') {
      super();
      this.setCorrelationId(correlationId);
    }
  }