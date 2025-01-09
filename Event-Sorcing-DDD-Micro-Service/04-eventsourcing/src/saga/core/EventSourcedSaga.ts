import { Injectable } from '@nestjs/common';
import { Event } from '../../eventsourcing/core/Event';



export abstract class EventSourcedSaga {
  private events: Event[] = [];
  private sequence: number = 0;
  private version: number = 0;

  private completeSaga: boolean = false;

  public abstract identifier(): string;

  public abstract completed(): boolean;

  public apply(event: Event, isNew: boolean = true): void {
      const eventHandlerName = `on${event.constructor.name}`;
      (this as any)[eventHandlerName](event);

      if (isNew) {
        event.setSequence( ++this.sequence);
      this.events.push(event);
      } else {
        this.sequence = event.getSequence();
      }
  }

  public getEvents(): Event[] {
    return this.events;
  }

  public getSequence(): number {
    return this.sequence;
  }

  public setSequence(sequence: number): void {
    this.sequence = sequence;
  }

  public getVersion(): number {
    return this.version;
  }

  public setVersion(version: number): void {
    this.version = version;
  }

  public isCompleteSaga(): boolean {
    return this.completeSaga;
  }

  public setCompleteSaga(complete: boolean): void {
    this.completeSaga = complete;
  }
}