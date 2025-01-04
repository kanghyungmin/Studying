import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
import { EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class Gateway {

  constructor(
    private readonly commandBus: CommandBus,  // CommandBus 주입
    private readonly queryBus: QueryBus,      // QueryBus 주입
    private readonly eventBus: EventBus,      // EventBus 주입

    private readonly eventEmitter: EventEmitter2
  ) {}

  // Command를 일반화하여 처리
  async sendCommand<T>(command: T): Promise<void> {
    console.log('Sending Command: ', command);
    this.eventEmitter.emit(command.constructor.name, command);
  }

  // // Query를 일반화하여 처리하고, 응답 타입을 제네릭으로 처리
  // async sendQuery<TQuery, TResult>(query: TQuery): Promise<void> {
  //   console.log('Sending Query: ', query);
  //   // return await this.queryBus.execute(query);
  //   this.eventEmitter.listeners
  // }

  // Event를 일반화하여 처리
  publishEvent<T>(event: T): void {
    console.log('Publishing Event: ', event);
    this.eventBus.publish(event);
  }
  publishEvnetOnlocal<T>(event : T): void {
    console.log('Publishing Event on local: ', event);
    this.eventEmitter.emit(event.constructor.name, event);
  }
}
