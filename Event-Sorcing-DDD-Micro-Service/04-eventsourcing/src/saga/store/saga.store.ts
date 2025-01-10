import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import { EventSourcedSaga } from '../core/EventSourcedSaga';
import { SagaRepository } from './jpa/saga.repo';
import { SagaEventRepository } from './jpa/saga.event.repo';
import { Saga } from './jpa/saga.orm';
import { SagaEvent } from './jpa/saga.event.orm';
import { Event } from 'src/eventsourcing/core/event'; 

@Injectable()
export class SagaStore<T extends EventSourcedSaga> {
  constructor(
    private readonly sagaRepository: SagaRepository,
    private readonly sagaEventRepository: SagaEventRepository,
  ) {}

  // Save the saga and its events to the database
  async save(saga: EventSourcedSaga): Promise<void> {
    const sagaJpo = new Saga(saga);
    await this.sagaRepository.save(sagaJpo);

    const eventJpos = saga.getEvents().map((event) => new SagaEvent(saga.identifier(), event));
    await this.sagaEventRepository.save(eventJpos);
  }

  // Load a saga by its ID and apply its events
  async load(sagaId: string): Promise<T> {
    const sagaJpo = await this.sagaRepository.findOne({ where: { id: sagaId } });
    if (!sagaJpo) {
      throw new Error(`Saga(${sagaId}) not found.`);
    }

    const eventJpos = await this.sagaEventRepository.findAllBySagaIdOrderBySequenceAsc(sagaId);
    const events = eventJpos.map((eventJpo) => eventJpo.toEvent());

    const saga : EventSourcedSaga= sagaJpo.toSaga();
    events.forEach((event) => {
      saga.apply(event, false);  // Assuming `apply` method exists on your saga class
    });

    saga.setSequence(sagaJpo.sequence);
    saga.setVersion(sagaJpo.version);

    return saga as T;
  }

  // Load all saga IDs
  async loadAll(): Promise<string[]> {
    const sagaJpos = await this.sagaRepository.find();
    return sagaJpos.map((sagaJpo) => sagaJpo.id);
  }
}