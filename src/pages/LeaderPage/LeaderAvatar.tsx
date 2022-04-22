import styles from './LeaderPage.scss';

export const LeaderAvatar = ({
    avatar,
    login,
}: {
    avatar: string;
    login: string;
}): JSX.Element => {
    if (avatar) {
        const imageUrl = `https://ya-praktikum.tech/api/v2/resources${avatar}`;
        return (
            <img
                className={styles.leader__avatar}
                src={imageUrl}
                alt="Avatar"
            />
        );
    }
    return <div className={styles.leader__avatar}>{login[0]}</div>;
};
