/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AcceptCall, CancelCall } from 'src/components/VideoChat/utils';
import { gameService } from 'src/store/services/gameService';
import { notificationService } from 'src/store/services/notificationService';
import { OnlineService } from 'src/store/services/onlineService';
import Peer, { SignalData } from 'simple-peer';
import { Socket } from 'socket.io-client';
import { VideoCallService } from 'src/store/services/videoCallService';
import { User } from 'src/store/reducers/user';
import { Icon } from 'src/components/Icon/Icon';
import { uOnline } from 'src/store/reducers/online';
import { PageLinks } from '../Routes/types';

export const acceptInvite = async (invitation: any) => {
    const response = await fetch(
        `${document.location.origin}/api/game/accept`,
        {
            method: 'POST',
            body: JSON.stringify({
                createdUserId: invitation.from._id,
                invitedUserId: invitation.to._id,
            }),
            headers: { 'Content-Type': 'application/json' },
        },
    );
    const data = await response.json();
    return data;
};

export const cancelInvite = async (invitation: any) => {
    const response = await fetch(
        `${document.location.origin}/api/game/cancel`,
        {
            method: 'POST',
            body: JSON.stringify({
                createdUserId: invitation.from._id,
                invitedUserId: invitation.to._id,
            }),
            headers: { 'Content-Type': 'application/json' },
        },
    );
    notificationService.smartDeleteNotification({
        selector: 'title',
        element: invitation.from.display_name,
    });
    const data = await response.json();
    return data;
};

export const SocketListener = (socket: Socket) => {
    socket.on('users:add', (data: any) => {
        OnlineService.addUserOnline(data);
    });

    socket.on('users:remove', (data: string) => {
        OnlineService.removeUserOnline(data);
    });

    socket.on('users:set', (data: uOnline[]) => {
        OnlineService.setUserOnline(data);
    });

    socket.on('messages:recived', (data) => {
        if (
            document.location.pathname !==
            (`${PageLinks.game}/${data.room}` &&
                `${PageLinks.chats}/${data.room}`)
        ) {
            notificationService.addNotification({
                title: `New message by ${data.user.display_name}`,
                message: data.text,
                autoDelete: true,
                autoDeleteTime: 15000,
                user: data.user,
                buttons: [
                    {
                        title: 'READ',
                        skin: 'regular',
                        color: 'yellow',
                        href: `${PageLinks.chats}/${data.room}`,
                    },
                ],
            });
        }
    });
    socket.on('game:invite', (data) => {
        notificationService.addNotification({
            title: data.from.display_name,
            message: 'Invites you to play',
            autoDelete: false,
            autoDeleteTime: 5000,
            user: data.from,
            buttons: [
                {
                    title: 'ACCEPT',
                    skin: 'regular',
                    color: 'green',
                    onClick: () => acceptInvite(data),
                },
                {
                    title: 'CANCEL',
                    skin: 'regular',
                    color: 'red',
                    onClick: () => cancelInvite(data),
                },
            ],
        });
    });
    socket.on('game:cancel', (data) => {
        notificationService.smartDeleteNotification({
            selector: 'title',
            element: data.user.display_name,
        });
    });
    socket.on('game:start', (data) => {
        notificationService.smartDeleteNotification({
            selector: 'title',
            element: data.user.display_name,
        });
        gameService.startGame({ room: data.room, id: data.gameId });
    });
    socket.on('game:step', (data) => {
        if (data.gameCancel) {
            gameService.gameCancel();
        } else {
            gameService.updateGameState({
                playerField: data.playerField,
                opponentField: data.opponentField,
                queue: data.queue,
                finish: data.gameOver,
                score: data.score,
                statistics: data.statistics,
            });
        }
    });

    socket.on('call:recived', ({ signal, from, room }) => {
        notificationService.addNotification({
            title: from.display_name,
            message: 'is calling you',
            autoDelete: false,
            autoDeleteTime: 5000,
            user: from,
            buttons: [
                {
                    title: Icon({ type: 'call' }),
                    skin: 'quad',
                    color: 'green',
                    onClick: () => AcceptCall({ from, socket, signal, room }),
                },
                {
                    title: Icon({ type: 'slashcall' }),
                    skin: 'quad',
                    color: 'red',
                    onClick: () => CancelCall({ from, socket }),
                },
            ],
        });
    });

    socket.on('call:cancel', (user: User) => {
        VideoCallService.connectClose();
        notificationService.addNotification({
            title: `${user.display_name}`,
            message: 'cancel call',
            autoDelete: true,
            autoDeleteTime: 3000,
            user,
        });
    });
};
