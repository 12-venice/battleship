import { io, Socket } from 'socket.io-client';

const HOST = 'localhost:5000';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(HOST);
