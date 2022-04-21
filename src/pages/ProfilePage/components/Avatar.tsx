// Требует деструктуризацию user
/* eslint-disable react/destructuring-assignment */
import { MouseEventHandler } from 'react';
import { User } from 'src/context/Authcontext';
import styles from '../ProfilePage.scss';

export const Avatar = (
    user: User,
    onClick?: MouseEventHandler<HTMLImageElement> | undefined,
): JSX.Element => {
    if (user?.avatar) {
        const imageUrl = `https://ya-praktikum.tech/api/v2/resources${user.avatar}`;
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
            {user.login ? user?.login[0] : ''}
        </div>
    );
};
