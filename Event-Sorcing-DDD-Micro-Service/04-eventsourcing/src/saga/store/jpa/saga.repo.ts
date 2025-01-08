import { EntityRepository, Repository } from 'typeorm';
import { Saga } from './saga.orm';

@EntityRepository(Saga)
export class SagaRepository extends Repository<Saga> {
  // Custom queries can be added here if necessary
}