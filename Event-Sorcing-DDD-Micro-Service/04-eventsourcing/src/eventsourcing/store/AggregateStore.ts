import { tokTypes } from './../../../node_modules/acorn/dist/acorn.d';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSourcedAggregate, EventOnES } from '../core/EventSourcedAggregate';
import { AggregateRepo } from './orm/AggregateRepo';
import { AggregateEventRepo } from './orm/AggregateEventRepo';
import { AggregateORM } from './orm/AggregateORM';


@Injectable()
export class AggregateStore<T extends EventSourcedAggregate> {
  constructor(
    private readonly aggregateRepository: AggregateRepo,
    private readonly aggregateEventRepository: AggregateEventRepo,
  ) {}

  async save(aggregate: EventSourcedAggregate): Promise<void> {
    // Save the aggregate entity
    const aggregateORM = this.aggregateRepository.create({
      id: aggregate.identifier(),
      type: aggregate.constructor.name,
      sequence: aggregate.getSequence(),
      version: aggregate.getVersion(),
      deleted: aggregate.isDeleted(),
    });
    //await this.aggregateRepository.save(aggregateORM);
    // Save related events
    const eventEntities = aggregate
      .getEvents()
      .map((event) =>
        this.aggregateEventRepository.create({
          aggregateId: aggregate.identifier(),
          ...event,
        }),
      );
    await this.aggregateEventRepository.save(eventEntities);
  }

  async load(aggregateId: string): Promise<T> {
    // Find the aggregate entity
    const aggregateORM = await this.aggregateRepository.findOne({
      where: { id: aggregateId },
    });

    if (!aggregateORM || aggregateORM.deleted) {
      throw new NotFoundException(
        `Aggregate(${aggregateId}) is not found or deleted.`,
      );
    }

    // Load related events
    const eventEntities = await this.aggregateEventRepository.findAllByAggregateIdandDeletedOrderBySequenceAsc(aggregateId, false);

    const events: EventOnES[] = eventEntities.map((entity) =>
      JSON.parse(entity.payload),
    );

    // Reconstruct the aggregate
    const aggregate: EventSourcedAggregate = aggregateORM.toAggregate()
    events.forEach((event) => aggregate.apply(event, false));
    aggregate.setSequence(aggregateORM.sequence);
    aggregate.setVersion(aggregateORM.version);

    return aggregate as T;
  }
}