import { EventEmitter2 } from 'eventemitter2';
import { Injectable } from '@nestjs/common';
import { Command } from './Command';
import { Event } from './Event';

@Injectable()
export class Gateway {

    constructor(private readonly eventEmitter : EventEmitter2) {
    }

    send(command : Command) : void {
        console.log('Command : ', command);
        this.eventEmitter.emit('command', command);
    }

    public publish(event : Event) : void {
        console.log('Event : ', event);
        this.eventEmitter.emit('event', event);
    }
}