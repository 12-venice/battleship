import { Socket } from 'socket.io';

export interface ISocket extends Socket {
    userID?: string;
}

export enum activeFieldList {
    invited,
    created,
}

export enum statisticsFields {
    hits,
    miss,
    alive,
    destroyed,
}
