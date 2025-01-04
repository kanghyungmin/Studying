import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Gateway } from './core/Gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccountORM } from './account/store/orm/AccoutOrm';
import { AccountRepo } from './account/store/orm/AccountRepo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountStore } from './account/store/AccountStore';
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


// DB_HOST=localhost
// DB_PORT=5454
// DB_USERNAME=kang
// DB_PASSWORD=1234
// DB_NAME=testDB
// DB_LOG_ENABLE=true

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',              // 데이터베이스 종류: PostgreSQL
      host: 'localhost',             // PostgreSQL 서버 주소 (localhost로 설정)
      port: 5454,                   // PostgreSQL 기본 포트 (5432)
      username: 'kang',     // PostgreSQL 사용자명
      password: '1234',     // PostgreSQL 비밀번호
      database: 'testDB',     // 사용할 데이터베이스 이름
      entities: [AccountORM,TransferORM],        // TypeORM에서 관리할 엔티티들
      synchronize: true,             // 개발 환경에서 테이블을 자동으로 생성해줍니다 (주의: 프로덕션에서는 false로 설정)
    }),
    EventEmitterModule.forRoot()

  ],
  controllers: [AppController, AccountController, TransferController],
  providers: [AppService, 
    AccountStore,
    AccountRepo,
    WithdrawHandler,
    DepositHandler,
    Gateway,
    AccountService,
    TransferService,
    TransferRepo,
    TransferStore,
    TransferOrchestrator,
  ],
})
export class AppModule {}
