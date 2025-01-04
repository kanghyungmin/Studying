import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';

@Injectable()
export class Gateway {

  constructor(
    private readonly commandBus: CommandBus,  // CommandBus 주입
    private readonly queryBus: QueryBus,      // QueryBus 주입
    private readonly eventBus: EventBus,      // EventBus 주입
  ) {}

  // Command를 일반화하여 처리
  async sendCommand<T>(command: T): Promise<void> {
    console.log('Sending Command: ', command);
    await this.commandBus.execute(command);
  }

  // Query를 일반화하여 처리하고, 응답 타입을 제네릭으로 처리
  async sendQuery<TQuery, TResult>(query: TQuery): Promise<TResult> {
    console.log('Sending Query: ', query);
    return await this.queryBus.execute(query);
  }

  // Event를 일반화하여 처리
  publishEvent<T>(event: T): void {
    console.log('Publishing Event: ', event);
    this.eventBus.publish(event);
  }
}
