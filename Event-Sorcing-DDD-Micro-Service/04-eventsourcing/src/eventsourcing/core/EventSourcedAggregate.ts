import { Injectable } from '@nestjs/common';
import { Event } from './Event';
import { Snapshot } from './Snapshot';


@Injectable()
export abstract class EventSourcedAggregate {
  private events: Event[] = [];
  private inSaga: boolean = false;
  private deleted: boolean = false;
  private sequence: number = 0;
  private version: number = 0;
  private snapshot: Snapshot | null = null;

  constructor() {}

  abstract identifier(): string;

    apply(event: Event, isNew: boolean = true): void {
    const eventHandlerName = `on${event.constructor.name}`;
    const eventHandler = (this as any)[eventHandlerName];

    if (typeof eventHandler !== 'function') {
      throw new Error(
        `Event handler not found for ${event.constructor.name} in ${
          this.constructor.name
        }`,
      );
    }

    eventHandler.call(this, event);

    if (isNew) {
      event.setSequence( ++this.sequence);
      this.events.push(event);
    } else {
      this.sequence = event.getSequence();
    }
  }

  takeSnapshot(): void {
    const currentTime = Date.now();
    if (!this.snapshot || currentTime - this.snapshot.getTime() > 600000) {
      this.snapshot = new Snapshot(JSON.stringify(this), currentTime);
    }
  }

  getSnapshot(): Snapshot | null {
    return this.snapshot;
  }

  getEvents(): Event[] {
    return this.events;
  }

  getSequence(): number {
    return this.sequence;
  }

  setSequence(sequence: number): void {
    this.sequence = sequence;
  }

  getVersion(): number {
    return this.version;
  }

  setVersion(version: number): void {
    this.version = version;
  }

  markDeleted(): void {
    this.deleted = true;
  }

  isDeleted(): boolean {
    return this.deleted;
  }

  isInSaga(): boolean {
    return this.inSaga;
  }

  protected startSaga(): void {
    this.inSaga = true;
  }

  protected endSaga(): void {
    this.inSaga = false;
  }
}