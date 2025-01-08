import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SagaEventRepository } from 'src/saga/store/jpa/saga.event.repo';  // Adjust the import path as necessary
import { Event } from 'src/eventsourcing/core/event';  // Adjust the import path as necessary

@Injectable()
export class SagaEventStore {
  constructor(
    @InjectRepository(SagaEventRepository)
    private readonly sagaEventRepository: SagaEventRepository,
  ) {}

  // Retrieve all unrelayed events
  async retrieveUnrelayedEvents(): Promise<Event[]> {
    const eventJpos = await this.sagaEventRepository.findAllByRelayed(false);
    return eventJpos.map((eventJpo) => eventJpo.toEvent());
  }

  // Update the relayed status of an event
  async update(event: Event): Promise<void> {
    const eventJpo = await this.sagaEventRepository.findOne({ where: { id: event.getEventId() } });
    if (eventJpo) {
      eventJpo.relayed = true;
      await this.sagaEventRepository.save(eventJpo);
    }
  }
}