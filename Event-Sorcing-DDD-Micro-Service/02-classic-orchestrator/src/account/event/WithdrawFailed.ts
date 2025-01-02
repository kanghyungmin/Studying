
import { Event } from "src/core/Event";

export class WithdrawFailed extends Event {
    transferId?: string | null;  // Optional field
  
    constructor( transferId?: string) {
      super();
      this.transferId = transferId ?? null; // Default to null if undefined
    }

    public getTransferId(): string {
        return this.transferId;
    }

    public setTransferId(transferId: string) {
        this.transferId = transferId;
    }
    
  }