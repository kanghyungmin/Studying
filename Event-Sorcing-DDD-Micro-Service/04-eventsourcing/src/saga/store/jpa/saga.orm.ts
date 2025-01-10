import { EventSourcedSaga } from 'src/saga/core/EventSourcedSaga';
import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';
import { JsonUtilService } from '../../../util/JsonUtil';
import { ClassConstructor } from 'class-transformer';

@Entity('TB_SAGA')
export class Saga {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column('bigint')
  sequence: number;

  @Column()
  inSaga: boolean;

  @VersionColumn()
  version: number;

  constructor(saga: EventSourcedSaga) {
    if(saga) {
        this.id = saga.identifier();
        this.type = saga.constructor.name;
        this.sequence = saga.getSequence();
        this.inSaga = false;
        this.version = saga.getVersion();
    }
  }

  toSaga<T>(): T {
    try {
      let test : ClassConstructor<T>  = this.type as unknown as ClassConstructor<T>;
      return JsonUtilService.fromJson('{}', test);
    } catch (e) {
      console.error(e);
      throw new Error('Failed to convert to Saga');
    }
  }
}