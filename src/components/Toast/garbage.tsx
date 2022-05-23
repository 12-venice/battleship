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
    const [list, setList] = useState<ToastType[]>([]);

    const deleteToast = useCallback(
        (index: number) => {
            list.splice(index, 1);
            setList([...list]);
        },
        [list],
    );

    useEffect(() => {
        const interval = setInterval(() => {
            if (list.length) {
                deleteToast(0);
            }
        }, 3000);
        return () => {
            clearInterval(interval);
        };
    }, [deleteToast, list.length]);

    const acceptInvite = (socketId?: string) => {
        socket.emit('invite:accept', socketId);
        navigation(PageLinks.game);
    };

    const cancelInvite = (index: number, socketId?: string) => {
        deleteToast(index);
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

    const addToast = (data: ToastType) => {
        const newToast = {
            id: uuidv4(),
            user: data.user ?? undefined,
            message: data.message ?? undefined,
            buttons: data.buttons ?? undefined,
        };
        setList([...list, newToast]);
    };

    const toastBlock = (
        <div
            className={cn(
                styles.toast__main,
                styles['toast__position__bottom-right'],
            )}
        >
            {list.map((toast) => (
                <div key={toast.id} className={styles.toast__block}>
                    {toast.user && Avatar(toast.user)}
                    {toast.message && <span>{toast.message}</span>}
                    {toast.buttons && (
                        <div className={styles['toast__block-buttons']}>
                            {toast.buttons.map((button) => (
                                <Button
                                    title={button.title}
                                    skin={button.skin}
                                    color={button.color}
                                    onClick={button.onClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
    return { addToast, toastBlock };
};
