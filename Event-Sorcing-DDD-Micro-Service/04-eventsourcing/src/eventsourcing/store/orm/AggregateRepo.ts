import { EntityManager, EntityRepository, Repository } from "typeorm";
import { AggregateORM } from "./AggregateORM";

@EntityRepository(AggregateORM)
export class AggregateRepo extends Repository<AggregateORM> {
    private readonly tName = 'TB_AGGREGATE';

    constructor(manager : EntityManager) {
        super(AggregateORM, manager);
    }

}