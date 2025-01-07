import { Class } from './../../../../node_modules/@types/estree/index.d';
import { Constructor } from './../../../../node_modules/make-error/index.d';
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Event } from '../../core/Event';
import { JsonUtilService } from '../../../util/JsonUtil';
import { ClassConstructor } from 'class-transformer';

@Entity('TB_AGGREGATE_EVENT')
export class AggregateEventORM {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  aggregateId: string;

  @Column('text') // JSON 데이터를 저장하므로 text 타입 사용
  payload: string;

  @Column({ type: 'bigint' })
  sequence: number;

  @Column({ type: 'bigint' })
  time: number;

  @Column({ default: false })
  relayed: boolean;

  @Column({ default: false })
  propagate: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true })
  correlationId: string;

  constructor(aggregateId?: string, event?: Event) {
    if (aggregateId && event) {
      this.id = event.getEventId();
      this.type = event.constructor.name;
      this.aggregateId = aggregateId;
      this.payload = event.getPayload();
      this.sequence = event.getSequence();
      this.time = event.getTime();
      this.relayed = event.isRelayed();
      this.propagate = event.isPropagate();
      this.correlationId = event.getCorrelationId();
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
      eventClass.setPropagate(this.propagate);
      eventClass.setCorrelationId(this.correlationId);
      return eventClass;
    } catch (error) {
      console.error('Error converting to Event:', error);
      throw new Error('Unable to convert payload to Event');
    }
  }
}