import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class TransferMoney {
  @IsString()
  transferId?: string; // Optional field (transient)

  @IsNotEmpty()
  @IsString()
  fromAccount: string;

  @IsNotEmpty()
  @IsString()
  toAccount: string;

  @IsPositive()
  amount: number;

  constructor(fromAccount: string, toAccount: string, amount: number, transferId?: string) {
    this.transferId = transferId;
    this.fromAccount = fromAccount;
    this.toAccount = toAccount;
    this.amount = amount;
  }
}