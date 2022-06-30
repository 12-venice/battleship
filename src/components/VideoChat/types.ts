import { User } from 'src/store/reducers/user';
import { SignalData } from 'simple-peer';
import { Socket } from 'socket.io-client';

export type acceptCallType = {
    from: User;
    signal: SignalData;
    socket: Socket;
    room: string;
};

export type cancelCallType = {
    from: User;
    socket: Socket;
};
