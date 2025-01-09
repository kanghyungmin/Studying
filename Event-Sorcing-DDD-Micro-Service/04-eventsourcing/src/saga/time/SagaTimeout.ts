import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SagaTimeExpired } from './SagaTimeExpired';


@Injectable()
export class SagaTimeout {
  constructor(
    private readonly correlationId: string,
    private readonly sagaType: string,
    private readonly applicationEventPublisher: EventEmitter2,
  ) {}

   run() {
    const sagaTimeExpired = new SagaTimeExpired(this.correlationId, this.sagaType);
    this.applicationEventPublisher.emit('sagaTimeExpired', sagaTimeExpired);
  }

  static expireTime(seconds: number): Date {
    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);
    return now;
  }
}