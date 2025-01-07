import { EntityManager, EntityRepository, Repository } from "typeorm";
import { AggregateEventORM } from "./AggreageteEventORM";

@EntityRepository(AggregateEventORM)
export class AggregateEventRepo extends Repository<AggregateEventORM> {
    private readonly tName = 'TB_AGGREGATE_EVENT';

    constructor(manager: EntityManager) {
        super(AggregateEventORM, manager);
    }

    public async findAllByAggregateIdandDeletedOrderBySequenceAsc(aggregateId: string,commandDeleted : boolean): Promise<AggregateEventORM[]> {
        return await this.find({ where: { aggregateId: aggregateId, deleted: commandDeleted }, order: { sequence: 'ASC' } });
    }
    public async findAllByRelayed(relayed: boolean): Promise<AggregateEventORM[]> {
        return await this.find({ where: { relayed: relayed } });
    }
    public async findAllByCorrelationId(correlationId: string): Promise<AggregateEventORM[]> {
        return await this.find({ where: { correlationId: correlationId } });
    }


}