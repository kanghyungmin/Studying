import { Controller, Get, Param } from '@nestjs/common';
import { EventSourcedSaga } from '../core/EventSourcedSaga';
import { SagaStore } from '../store/saga.store';


@Controller('saga')
export class SagaEndpoint {
  constructor(private readonly sagaStore: SagaStore<EventSourcedSaga>) {}

  @Get()
  async querySagas(): Promise<string[]> {
    // 모든 Saga를 조회합니다.
    return await this.sagaStore.loadAll();
  }

  @Get(':sagaId')
  async querySaga(@Param('sagaId') sagaId: string): Promise<EventSourcedSaga> {
    // 특정 Saga를 조회합니다.
    return await this.sagaStore.load(sagaId);
  }
}