import { CancelTransfer } from "../command/CancelTransfer";
import { CompleteDeposit } from "../command/CompleteDeposit";
import { CompleteWithdraw } from "../command/CompleteWithdraw";
import { TransferMoney } from "../command/TransferMoney";


export class Transfer {
  transferId: string;
  fromAccount: string;
  withdrawed: boolean = false;
  toAccount: string;
  deposited: boolean = false;
  amount: number;
  completed: boolean = false;
  private _version: number = 0;

  constructor(command: TransferMoney) {
    this.transferId = command.transferId!;
    this.fromAccount = command.fromAccount;
    this.toAccount = command.toAccount;
    this.amount = command.amount;
  }

  completeDeposit(command: CompleteDeposit): void {
    this.deposited = true;
    this.complete();
  }

  completeWithdraw(command: CompleteWithdraw): void {
    this.withdrawed = true;
    this.complete();
  }

  private complete(): void {
    // 비동기 처리와 유사한 작업을 필요로 할 경우 적용 가능
    if (this.withdrawed && this.deposited) {
      this.completed = true;
    }
  }

  cancel(command: CancelTransfer): void {
    this.completed = false;
  }

  get version(): number {
    return this._version;
  }

  set version(version: number) {
    this._version = version;
  }
  public setTransferId(transferId : string) {
        this.transferId = transferId;
    }
    public setFromAccount(fromAccount : string) {
        this.fromAccount = fromAccount;
    }
    public setToAccount(toAccount : string) {
        this.toAccount = toAccount;
    }
    public setAmount(amount : number) {
        this.amount = amount;
    }
    public getTransferId() : string {
        return this.transferId;
    }
    public getFromAccount() : string {
        return this.fromAccount;
    }
    public getToAccount() : string {
        return this.toAccount;
    }
    public getAmount() : number {
        return this.amount;
    }
    public getCompleted() : boolean {
        return this.completed;
    }
    public setCompleted(completed : boolean) {
        this.completed = completed;
    }
    public getWithdrawed() : boolean {
        return this.withdrawed;
    }
    public setWithdrawed(withdrawed : boolean) {
        this.withdrawed = withdrawed;
    }
    public getDeposited() : boolean {
        return this.deposited;
    }
    public setDeposited(deposited : boolean) {
        this.deposited = deposited;
    }
    public getVersion() : number {
        return this._version;
    }
    public setVersion(version : number) {
        this._version = version;
    }
    
}
