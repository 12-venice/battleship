/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-curly-newline */
import { useParams } from 'react-router-dom';
import { notificationService } from 'src/store/services/notificationService';
import { OnlineService } from 'src/store/services/onlineService';
import { PageLinks } from '../Routes/types';
import { socket } from './Socket';

export const AcceptInvite = (nav, room?: string) => {
    socket.emit('invite:accept', room);
    nav(`${PageLinks.game}/${room._id}`);
};

export const CancelInvite = (room?: string) => {
    socket.emit('invite:cancel', room);
};

export const SendMessage = (data: any) => {
    socket.emit('messages:sent', data);
};

export const Listener = (nav: Function, pathname: string) => {
    socket.on('userOnline:add', (data) => {
        OnlineService.addUserOnline(data);
    });

    socket.on('userOnline:remove', (data) => {
        OnlineService.removeUserOnline(data);
    });

    socket.on('userOnline:set', (data) => {
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
            title: data.user.display_name,
            message: 'Invites you to play',
            autoDelete: true,
            autoDeleteTime: 5000,
            user: data.user,
            buttons: [
                {
                    title: 'ACCEPT',
                    skin: 'small',
                    color: 'orange',
                    onClick: () => AcceptInvite(nav, data.room),
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
        if (pathname !== `${PageLinks.game}/${data.room}`) {
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
                    },
                ],
            });
        }
    });
};
