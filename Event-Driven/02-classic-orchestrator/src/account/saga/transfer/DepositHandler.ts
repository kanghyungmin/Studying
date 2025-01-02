import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices'; // EventPattern을 사용하여 이벤트 리스닝
import { CancelDeposit } from 'src/account/command/CancelDeposit';
import { Deposit } from 'src/account/command/Deposit';
import { AccountService } from 'src/account/service/account.service';

@Injectable()
export class DepositHandler {
  constructor(private readonly accountService: AccountService) {}

  @EventPattern('deposit_event') // 'deposit_event'는 이벤트의 이름입니다. 실제 이벤트 이름에 맞게 조정하세요.
  async onDeposit(command: Deposit): Promise<void> {
    await this.accountService.deposit(command);
  }

  @EventPattern('cancel_deposit_event') // 'cancel_deposit_event'는 이벤트의 이름입니다. 실제 이벤트 이름에 맞게 조정하세요.
  async onCancelDeposit(command: CancelDeposit): Promise<void> {
    await this.accountService.cancelDeposit(command);
  }
}