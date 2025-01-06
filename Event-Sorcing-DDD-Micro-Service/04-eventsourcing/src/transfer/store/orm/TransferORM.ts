import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';

import { IsBoolean, IsString, IsInt } from 'class-validator';  // Optionally, you can add validation decorators
import { Transfer } from 'src/transfer/aggregate/Transfer';

@Entity('TB_TRANSFER')  // Define the table name
export class TransferORM {
  @PrimaryColumn()
  transferId: string;

  @Column()
  @IsString()
  fromAccount: string;

  @Column()
  @IsBoolean()
  withdrawed: boolean;

  @Column()
  @IsString()
  toAccount: string;

  @Column()
  @IsBoolean()
  deposited: boolean;

  @Column()
  @IsInt()
  amount: number;

  @Column()
  @IsBoolean()
  completed: boolean;

  @VersionColumn()
  version: number;

  // Constructor to map from Transfer object to TransferEntity
  constructor(transfer?: Transfer) {
    if (transfer) {
      this.transferId = transfer.transferId;
      this.fromAccount = transfer.fromAccount;
      this.withdrawed = transfer.withdrawed;
      this.deposited = transfer.deposited;
  
      this.completed = transfer.completed;
      this.version = transfer.version;      
      this.toAccount = transfer.toAccount;
      this.amount = transfer.amount;
    }


  }

  // Method to convert TransferEntity back to Transfer domain object
  toTransfer(): Transfer {
    let ret = new Transfer({
        transferId: this.transferId,
        fromAccount: this.fromAccount,
        amount : this.amount,
        
        toAccount: this.toAccount,
    });
    ret.setDeposited(this.deposited);
    ret.setWithdrawed(this.withdrawed);
    ret.setCompleted(this.completed);  
    ret.version = this.version;
      
   return ret; 
  }
}
