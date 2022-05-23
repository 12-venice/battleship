/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react';
import cn from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import styles from './Toast.scss';
import { Props } from './types';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { notificationService } from 'src/store/services/notificationService';

export const Toast: FC<Props> = ({
    position,
    autoDelete,
    autoDeleteTime,
}) => {
    const list = useSelector((state: AllStateTypes) => state.notification);

    const deleteToast = (id: string) => {
        notificationService.deleteNotification(id);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoDelete && list.length) {
                deleteToast(list[0].id as string);
            }
        }, autoDeleteTime);
        return () => {
            clearInterval(interval);
        };
    }, [autoDelete, autoDeleteTime, list]);

    return (
        <div className={cn(styles['notification-container'], styles[position])}>
            {list.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(styles.notification, styles[position], toast.type && styles[toast.type])}
                >
                    <button
                        className={styles['notification-close']}
                        onClick={() => deleteToast(toast.id || '')}
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
