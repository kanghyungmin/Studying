
export class QueryTransfer {

    private transferId : string;

    constructor( transferId : string
    ) {
        this.transferId = transferId;
    }

    public getTransferId() : string {
        return this.transferId;
    }

    public setTransferId(transferId : string) {
        this.transferId = transferId;
    }
}