import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Event } from '../../eventsourcing/core/Event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SagaEventStore } from '../store/saga.event.store';
import { Gateway } from 'src/eventsourcing/core/Gateway';

@Injectable()
export class SagaEventRelay {
  private readonly logger = new Logger(SagaEventRelay.name);

  constructor(
    private readonly sagaEventStore: SagaEventStore,
    // private readonly eventEmitter: EventEmitter2,
    private readonly gateway : Gateway
  ) {}

  @Cron('*/1 * * * * *') // 매 1초마다 실행
  async publish() {
    const events: Event[] = await this.sagaEventStore.retrieveUnrelayedEvents();
    events.forEach((event) => {
      if (event.isPropagate()) {
        this.logger.log(`SagaEventRelay.publish(${event.constructor.name}) and ${event}`);
        // this.eventEmitter.emit(event.constructor.name, event);
        this.gateway.publishEvnetOnlocal(event)
        
      }
      this.sagaEventStore.update(event);
    });
  }
}