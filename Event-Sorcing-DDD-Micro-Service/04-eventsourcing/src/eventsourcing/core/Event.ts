import { JsonUtilService } from 'src/util/JsonUtil';
import { v4 as uuidv4 } from 'uuid';


export abstract class Event {
  private eventId: string;
  private sequence: number = 0;
  private time: number;
  private correlationId?: string;
  private relayed: boolean = false;
  private propagate: boolean = true;

  constructor() {
    this.eventId = uuidv4();
    this.time = Date.now();
  }

  // Getter and Setter for eventId
  public getEventId(): string {
    return this.eventId;
  }

  public setEventId(eventId: string): void {
    this.eventId = eventId;
  }

  // Getter and Setter for sequence
  public getSequence(): number {
    return this.sequence;
  }

  public setSequence(sequence: number): void {
    this.sequence = sequence;
  }

  // Getter and Setter for time
  public getTime(): number {
    return this.time;
  }

  public setTime(time: number): void {
    this.time = time;
  }

  // Getter and Setter for correlationId
  public getCorrelationId(): string | undefined {
    return this.correlationId;
  }

  public setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  // Method to get JSON payload of the event
  public getPayload(): string {
    return JsonUtilService.toJson(this);
  }

  // Method to get type name of the event
  public getTypeName(): string {
    return this.constructor.name;
  }

  // Getter and Setter for propagate
  public isPropagate(): boolean {
    return this.propagate;
  }

  public setPropagate(propagate: boolean): void {
    this.propagate = propagate;
  }

  // Getter and Setter for relayed
  public isRelayed(): boolean {
    return this.relayed;
  }

  public setRelayed(relayed: boolean): void {
    this.relayed = relayed;
  }
}