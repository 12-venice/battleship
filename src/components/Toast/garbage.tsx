/* eslint-disable react/jsx-curly-newline */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import cn from 'classnames';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { PageLinks } from '../utils/Routes/types';
import { socket } from '../utils/Socket/Socket';
import styles from './Toast.scss';
import { ToastType } from './types';

export const Toast = () => {
    const navigation = useNavigate();

    const acceptInvite = (socketId?: string) => {
        socket.emit('invite:accept', socketId);
        navigation(PageLinks.game);
    };

    const cancelInvite = (index: number, socketId?: string) => {
        socket.emit('invite:cancel', socketId);
    };

    socket.on('invite:accept', (data) => {
        list.push({
            id: uuidv4(),
            message: `${data.user.display_name} accepted the invitation`,
            user: data.user,
        });
        setList([...list]);
        navigation(PageLinks.game);
    });

    socket.on('invite:cancel', (data) => {
        list.push({
            id: uuidv4(),
            message: `${data.user.display_name} refused the invitation`,
            user: data.user,
        });
        setList([...list]);
    });

    socket.on('invite:recive', (data) => {
        list.push({
            id: uuidv4(),
            message: `${data.user.display_name} invites you to play`,
            user: data.user,
        });
        setList([...list]);
    });

};
