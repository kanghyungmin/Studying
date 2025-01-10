import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { SagaEvent } from './saga.event.orm';


@EntityRepository(SagaEvent)
export class SagaEventRepository extends Repository<SagaEvent> {
  private readonly tName = 'TB_SAGA_EVENT';

  constructor(manager: EntityManager) {
    super(
        SagaEvent,
        manager
    );
  }
  // Find all events by sagaId, ordered by sequence in ascending order
  async findAllBySagaIdOrderBySequenceAsc(sagaId: string): Promise<SagaEvent[]> {
    return await this.find({
        where: { sagaId },
        order: { sequence: 'ASC' },
    });
  }

  // Find all events by relayed status
  async findAllByRelayed(relayed: boolean): Promise<SagaEvent[]> {
    return await this.find({ where: { relayed } });
  }
}