

export class Snapshot {
    private  payload: string;
    private  time: number;

    constructor(
        payload: string,
        time: number,
    ) {
        this.payload = payload?? null;
        this.time = time?? null;
    }

    public getPayload(): string {
        return this.payload;
    }
    public getTime(): number {  
        return this.time;
    }

    public setPayload(payload: string): void {
        this.payload = payload;
    }
    public setTime(time: number): void {
        this.time = time;
    }   
}