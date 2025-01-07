


export class AccountView {
    private no : string;
    private balance : number;

    constructor(no : string, balance : number) {
        this.no = no;
        this.balance = balance;
    }

    getNo() : string {
        return this.no;
    }

    getBalance() : number {
        return this.balance;
    }
    
    setBalance(balance : number) {
        this.balance = balance;
    }

}