export class SagaTimeExpired {
    
    constructor(
      public correlationId: string,
      public sagaType: string,
    ) {}
    getCorrelationId() : string {
        return this.correlationId;
    }
  }