import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountORM } from './orm/AccoutOrm';
import { Account } from '../aggregate/Account';
import { AccountRepo } from './orm/AccountRepo';



@Injectable()
export class AccountStore {
  constructor(
    
    private readonly accountRepository: AccountRepo
  ) {}

  // 계좌 생성
  async create(account: Account): Promise<void> {
    const accountOrm = new AccountORM(account);
    await this.accountRepository.addUser(accountOrm);
  }

  // 계좌 조회
  async retrieve(no: string): Promise<Account> {
    const accountOrm = await this.accountRepository.findUser(
        {no});
    if (!accountOrm) {
      throw new NotFoundException('Account not found');
    }
    return accountOrm.toAccount();
  }

  // 계좌 업데이트
  async update(account: Account): Promise<void> {
    const accountOrm = new AccountORM(account);
    await this.accountRepository.save(accountOrm);
  }
}