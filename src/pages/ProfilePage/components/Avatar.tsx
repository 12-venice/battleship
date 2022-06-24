// @ts-nocheck
// Требует деструктуризацию user
/* eslint-disable react/destructuring-assignment */
import { MouseEventHandler } from 'react';
import { User } from 'src/store/reducers/user';
import styles from '../ProfilePage.scss';

export const Avatar = (
    user: User | null,
    onClick?: MouseEventHandler<HTMLImageElement> | undefined,
): JSX.Element => {
    if (user?.avatar) {
        const imageUrl = user.avatar;
        return (
            <img
                aria-hidden
                className={styles.profile__avatar}
                src={imageUrl}
                alt="Avatar"
                onClick={onClick}
            />
        );
    }
    return (
        <div aria-hidden className={styles.profile__avatar} onClick={onClick}>
            {user?.login ? user?.login[0] : ''}
        </div>
    );
};
