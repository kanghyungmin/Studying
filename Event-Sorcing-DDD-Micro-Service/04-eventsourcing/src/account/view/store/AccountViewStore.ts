import { Injectable, NotFoundException } from '@nestjs/common';



import { AccountViewRepo } from './orm/AccountViewRepo';
import { AccountViewORM } from './orm/AccountViewORM';
import { AccountView } from '../AccountView';



@Injectable()
export class AccountViewStore {
  constructor(
    private readonly accountViewRepo: AccountViewRepo
  ) {}

  // 계좌 생성
  async create(account: AccountView): Promise<void> {
    const accountOrm = new AccountViewORM(account);
    await this.accountViewRepo.addUser(accountOrm);
  }

  // 계좌 조회
  async retrieve(no: string): Promise<AccountView> {
    const accountOrm = await this.accountViewRepo.findUser(
        {no});
    if (!accountOrm) {
      throw new NotFoundException('Account not found');
    }
    return accountOrm.toAccountView();
  }

  // 계좌 업데이트
  async update(account: AccountView): Promise<void> {
    const accountOrm = new AccountViewORM(account);
    await this.accountViewRepo.save(accountOrm);
  }

  async exists(no: string): Promise<boolean> {
    const account = await this.accountViewRepo.findUser({ no });
    return !!account;
  }
}