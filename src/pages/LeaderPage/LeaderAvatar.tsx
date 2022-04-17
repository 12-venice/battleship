// Требует деструктуризацию user
/* eslint-disable react/destructuring-assignment */
import styles from './LeaderPage.scss';

export const LeaderAvatar = (user: {
    avatar: string;
    login: string;
}): JSX.Element => {
    if (user.avatar) {
        const imageUrl = `https://ya-praktikum.tech/api/v2/resources${user.avatar}`;
        return (
            <img
                className={styles.leader__avatar}
                src={imageUrl}
                alt="Avatar"
            />
        );
    }
    return <div className={styles.leader__avatar}>{user.login[0]}</div>;
};
