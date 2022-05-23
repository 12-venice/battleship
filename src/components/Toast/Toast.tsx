/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import styles from './Toast.scss';
import { Props, ToastType } from './types';

export const Toast: FC<Props> = ({
    toastList,
    position,
    autoDelete,
    autoDeleteTime,
}) => {
    const [list, setList] = useState<ToastType[]>(toastList);

    const deleteToast = (id: string) => {
        const listItemIndex = list.findIndex((toast) => toast.id === id);
        const toastListItem = toastList.findIndex((toast) => toast.id === id);
        list.splice(listItemIndex, 1);
        toastList.splice(toastListItem, 1);
        setList([...list]);
    };

    useEffect(() => {
        setList([...toastList]);
    }, [toastList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoDelete && toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, autoDeleteTime);
        return () => {
            clearInterval(interval);
        };
    }, [toastList, autoDelete, autoDeleteTime, list]);

    return (
        <div className={cn(styles['notification-container'], styles[position])}>
            {list.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(styles.notification, styles[position])}
                >
                    <button
                        className={styles['notification-close']}
                        onClick={() => deleteToast(toast.id)}
                    >
                        x
                    </button>
                    {toast.user && (
                        <div className={styles['notification-image']}>
                            {Avatar(toast.user)}
                        </div>
                    )}
                    {toast.title && (
                        <p className={styles['notification-title']}>
                            {toast.title}
                        </p>
                    )}
                    <p className={styles['notification-message']}>
                        {toast.message}
                    </p>
                    {toast.buttons && toast.buttons.length > 0 && (
                        <p className={styles['notification-buttons']}>
                            {toast.buttons.map((button) => (
                                <Button
                                    key={uuidv4()}
                                    title={button.title}
                                    skin="small"
                                    onClick={button.onClick}
                                />
                            ))}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};
