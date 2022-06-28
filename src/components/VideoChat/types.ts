import { User } from 'src/store/reducers/user';
import { SignalData } from 'simple-peer';
import { Socket } from 'socket.io-client';

export type acceptCallType = {
    from: string;
    signal: SignalData;
    socket: Socket;
};

export type cancelCallType = {
    fromUser: User;
    socket: Socket;
};
