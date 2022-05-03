import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000');
socket.on('connect', () => {
    console.log('Socket connect ', socket.id);
});

socket.on('disconnect', () => {
    console.log('Socket disconnect');
});
