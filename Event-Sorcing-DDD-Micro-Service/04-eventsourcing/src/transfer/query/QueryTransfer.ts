import { Query } from "src/eventsourcing/core/Query";


export class QueryTransfer extends Query{
  constructor(public readonly transferId: string) {
    super();
  }
}
