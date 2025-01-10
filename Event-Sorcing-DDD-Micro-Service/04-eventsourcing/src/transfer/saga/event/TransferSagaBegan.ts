import { Event } from "src/eventsourcing/core/Event";

export class TransferSagaBegan extends Event{
  constructor(
    
    public  transferId: string,
    public  fromAccountNo: string,
    public  toAccountNo: string,
    public  amount: number,
  ) {
    super();
    console.log('TransferSagaBegan')
  }
public getTransferId(): string {
    return this.transferId;
}

public setTransferId(transferId: string): void {
    this.transferId = transferId;
}

public getFromAccountNo(): string {
    return this.fromAccountNo;
}

public setFromAccountNo(fromAccountNo: string): void {
    this.fromAccountNo = fromAccountNo;
}

public getToAccountNo(): string {
    return this.toAccountNo;
}

public setToAccountNo(toAccountNo: string): void {
    this.toAccountNo = toAccountNo;
}

public getAmount(): number {
    return this.amount;
}

public setAmount(amount: number): void {
    this.amount = amount;
}
}
