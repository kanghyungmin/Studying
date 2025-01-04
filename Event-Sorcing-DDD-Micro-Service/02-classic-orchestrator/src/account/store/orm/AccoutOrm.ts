import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';
import { Account } from '../../aggregate/Account';


@Entity({name : 'TB_ACCOUNT'})
export class AccountORM {
  @PrimaryColumn()
  no: string;

  @Column()
  balance: number;

  @VersionColumn()
  version: number;

  // 기본 생성자
  constructor(account : Account) {
    if(account) {
    this.no = account.getNo();
    this.balance = account.getBalance();
    this.version = account.getVersion();
    }
  }

  // Account 객체에서 AccountJpo 객체로 변환
  // static fromAccount(account: Account): AccountORM {
  //   return new AccountORM(account.getNo(), account.getBalance(), account.getVersion());
  // }

  // AccountJpo 객체에서 Account 객체로 변환
  toAccount(): Account {
    return new Account(null, {
      no: this.no,
      balance: this.balance,
      version: this.version
      
    });
  }
}