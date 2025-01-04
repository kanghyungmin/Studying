import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPattern } from '@nestjs/microservices'; // EventPattern을 사용하여 이벤트 리스닝
import { CancelDeposit } from 'src/account/command/CancelDeposit';
import { Deposit } from 'src/account/command/Deposit';
import { AccountService } from 'src/account/service/account.service';

@Injectable()
export class DepositHandler {
  constructor(private readonly accountService: AccountService) {}

  @OnEvent(Deposit.name)
  async onDeposit(command: Deposit): Promise<void> {
    await this.accountService.deposit(command);
  }

  @OnEvent(CancelDeposit.name)
  async onCancelDeposit(command: CancelDeposit): Promise<void> {
    await this.accountService.cancelDeposit(command);
  }
}