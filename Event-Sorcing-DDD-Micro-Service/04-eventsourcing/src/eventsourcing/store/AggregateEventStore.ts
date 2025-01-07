import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../core/Event'; // Adjust the import path as necessary
import { AggregateEventRepo } from './orm/AggregateEventRepo';

@Injectable()
export class AggregateEventStore {
  constructor(
    private readonly aggregateEventRepository: AggregateEventRepo,
  ) {}

  // Retrieve unrelayed events
  async retrieveUnrelayedEvents(): Promise<Event[]> {
    const eventEntities = await this.aggregateEventRepository.find({
      where: { relayed: false },
    });
    return eventEntities.map((entity) => entity.toEvent());
  }

  // Update an event to mark it as relayed
  async update(event: Event): Promise<void> {
    const eventEntity = await this.aggregateEventRepository.findOne({
      where: { id: event.getEventId() },
    });

    if (eventEntity) {
      eventEntity.relayed = true;
      await this.aggregateEventRepository.save(eventEntity);
    }
  }

  // Mark events as deleted by transferId
  async markDelete(transferId: string): Promise<void> {
    const eventEntities = await this.aggregateEventRepository.find({
      where: { correlationId: transferId },
    });

    eventEntities.forEach((entity) => {
      entity.deleted = true;
    });

    await this.aggregateEventRepository.save(eventEntities);
  }
}