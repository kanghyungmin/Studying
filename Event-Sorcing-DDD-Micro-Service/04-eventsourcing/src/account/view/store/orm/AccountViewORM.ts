import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';
import { AccountView } from '../../AccountView';



@Entity({name : 'TB_ACCOUNT_VIEW'})
export class AccountViewORM {

  @PrimaryColumn()
  no: string;

  @Column()
  balance: number;

  
  // 기본 생성자
  constructor(account : AccountView) {
    if(account) {
    this.no = account.getNo();
    this.balance = account.getBalance();
    }
  }

  toAccountView(): AccountView {
    return new AccountView(this.no, this.balance);
  }


}