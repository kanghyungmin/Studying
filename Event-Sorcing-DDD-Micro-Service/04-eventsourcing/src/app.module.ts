import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawHandler } from './account/saga/transfer/WithdrawHandler';
import { DepositHandler } from './account/saga/transfer/DepositHandler';
import { AccountService } from './account/service/account.service';
import { AccountController } from './account/controller/account.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TransferController } from './transfer/controller/transfer.controller';
import { TransferService } from './transfer/service/TransferService';
import { TransferRepo } from './transfer/store/orm/TransferRepo';
import { TransferStore } from './transfer/store/TransferStore';
import { TransferOrchestrator } from './transfer/saga/transfer/TransferOrchestrator';
import { TransferORM } from './transfer/store/orm/TransferORM';
import { ScheduleModule } from '@nestjs/schedule';
import { Gateway } from './eventsourcing/core/Gateway';
import { AccountEventHandler } from './account/view/AccountEventHandler';
import { AccountViewStore } from './account/view/store/AccountViewStore';
import { AccountViewORM } from './account/view/store/orm/AccountViewORM';
import { AccountViewRepo } from './account/view/store/orm/AccountViewRepo';
import { EventSourcedAggregate } from './eventsourcing/core/EventSourcedAggregate';
import { SagaEndpoint } from './saga/controller/saga.controller';
import { EventSourcedSaga } from './saga/core/EventSourcedSaga';
import { SagaEventRelay } from './saga/relay/saga.relay';
import { SagaEventRepository } from './saga/store/jpa/saga.event.repo';
import { SagaRepository } from './saga/store/jpa/saga.repo';
import { SagaEventStore } from './saga/store/saga.event.store';
import { SagaStore } from './saga/store/saga.store';
import { SagaEvent } from './saga/store/jpa/saga.event.orm';
import { Saga } from './saga/store/jpa/saga.orm';
import { AggregateStore } from './eventsourcing/store/AggregateStore';
import { AggregateEventStore } from './eventsourcing/store/AggregateEventStore';
import { AggregateORM } from './eventsourcing/store/orm/AggregateORM';
import { AggregateEventORM } from './eventsourcing/store/orm/AggreageteEventORM';
import { AggregateEventRepo } from './eventsourcing/store/orm/AggregateEventRepo';
import { AggregateRepo } from './eventsourcing/store/orm/AggregateRepo';


// DB_HOST=localhost
// DB_PORT=5454
// DB_USERNAME=kang
// DB_PASSWORD=1234
// DB_NAME=testDB
// DB_LOG_ENABLE=true

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',              // 데이터베이스 종류: PostgreSQL
      host: 'localhost',             // PostgreSQL 서버 주소 (localhost로 설정)
      port: 5454,                   // PostgreSQL 기본 포트 (5432)
      username: 'kang',     // PostgreSQL 사용자명
      password: '1234',     // PostgreSQL 비밀번호
      database: 'testDB',     // 사용할 데이터베이스 이름
      entities: [AggregateORM, AggregateEventORM, AccountViewORM,SagaEvent,Saga],        // TypeORM에서 관리할 엔티티들
      synchronize: true,             // 개발 환경에서 테이블을 자동으로 생성해줍니다 (주의: 프로덕션에서는 false로 설정)
    }),
    EventEmitterModule.forRoot()

  ],
  controllers: [AppController,
  AccountController], //TransferController],
  providers: [AppService, 
    AccountEventHandler,
    AccountViewStore,
    AccountViewRepo,
    AccountService,
    AggregateStore,
    AggregateEventStore,
    AggregateEventRepo,
    AggregateRepo,
    


    //saga & core
    Gateway,
    SagaEndpoint,
    SagaEventRelay,
    SagaEventRepository,
    SagaRepository,
    SagaEventStore,
    SagaStore,
  ],
})
export class AppModule {}
