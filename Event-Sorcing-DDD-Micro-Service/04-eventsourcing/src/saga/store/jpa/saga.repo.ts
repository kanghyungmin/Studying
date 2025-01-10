import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Saga } from './saga.orm';

@EntityRepository(Saga)
export class SagaRepository extends Repository<Saga> {
    private readonly tName = 'TB_SAGA';

    constructor(manager : EntityManager) {
            super(Saga, manager);
        }
}