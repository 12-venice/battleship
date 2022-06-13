/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { io, Socket } from 'socket.io-client';
import { notificationService } from 'src/store/services/notificationService';
import { OnlineService } from 'src/store/services/onlineService';
import { PageLinks } from '../Routes/types';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
});

export const AcceptInvite = (room?: string) => {
    socket.emit('invite:accept', room);
};

export const CancelInvite = (room?: string) => {
    socket.emit('invite:cancel', room);
};

socket.on('users:add', (data: string) => {
    OnlineService.addUserOnline(data);
});

socket.on('users:remove', (data: string) => {
    OnlineService.removeUserOnline(data);
});

socket.on('users:set', (data: string[]) => {
    OnlineService.setUserOnline(data);
});

socket.on('invite:accept', (data) => {
    notificationService.addNotification({
        title: data.user.display_name,
        message: 'Аccepted the invitation',
        autoDelete: false,
        autoDeleteTime: 5000,
        type: 'success',
        user: data.user,
    });
});

socket.on('invite:cancel', (data) => {
    notificationService.addNotification({
        title: data.user.display_name,
        message: 'Refused the invitation',
        autoDelete: true,
        autoDeleteTime: 5000,
        type: 'danger',
        user: data.user,
    });
});

socket.on('invite:recive', (data) => {
    notificationService.addNotification({
        title: data.display_name,
        message: 'Invites you to play',
        autoDelete: true,
        autoDeleteTime: 5000,
        user: data,
        buttons: [
            {
                title: 'ACCEPT',
                skin: 'small',
                color: 'orange',
                onClick: () => AcceptInvite(data.room),
            },
            {
                title: 'CANCEL',
                skin: 'small',
                color: 'red',
                onClick: () => CancelInvite(data.room),
            },
        ],
    });
});

socket.on('messages:recive', (data) => {
    if (document.location.pathname !== `${PageLinks.game}/${data.room}`) {
        notificationService.addNotification({
            title: `New message by ${data.user.display_name}`,
            message: data.text,
            autoDelete: true,
            autoDeleteTime: 15000,
            user: data.user,
            buttons: [
                {
                    title: 'READ',
                    skin: 'small',
                    color: 'green',
                    href: `${PageLinks.game}/${data.room}`,
                },
            ],
        });
    }
});
