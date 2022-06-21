import styles from './ProfilePage.scss';

export const Avatar = ({
    avatar,
    login,
}: {
    avatar: string;
    login: string;
}): JSX.Element => {
    if (avatar) {
        const imageUrl = avatar;
        return (
            <img
                className={styles.profile__avatar}
                src={imageUrl}
                alt="Avatar"
            />
        );
    }
    return <div className={styles.profile__avatar}>{login[0]}</div>;
};
