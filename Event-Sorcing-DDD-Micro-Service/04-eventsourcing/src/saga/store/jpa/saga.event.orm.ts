import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Event } from 'src/eventsourcing/core/event';  // Adjust the import path as necessary
import { JsonUtilService } from '../../../util/JsonUtil';
import { ClassConstructor } from 'class-transformer';

@Entity('TB_SAGA_EVENT')
export class SagaEvent {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  sagaId: string;

  @Column()
  payload: string;

  @Column('bigint')
  sequence: number;

  @Column('bigint')
  time: number;

  @Column()
  relayed: boolean;

  constructor(sagaId: string, event: Event) {
    if(sagaId && event ) {
        this.id = event.getEventId();
        this.type = event.constructor.name;
        this.sagaId = sagaId;
        this.payload = event.getPayload();
        this.sequence = event.getSequence();
        this.time = event.getTime();
        this.relayed = event.isRelayed();
    }
  }

  toEvent<T extends Event>(): T {
    try {
        let test : ClassConstructor<T>  = this.type as unknown as ClassConstructor<T>;
        let eventClass = JsonUtilService.fromJson<T>(this.payload, test);
        eventClass.setEventId(this.id);
        eventClass.setSequence(this.sequence);
        eventClass.setTime(this.time);
        eventClass.setRelayed(this.relayed);
      return eventClass;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to convert to Event');
    }
  }
}