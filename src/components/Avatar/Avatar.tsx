import styles from './Avatar.scss';

export const Avatar = ({
    avatar,
    login,
}: {
    avatar: string | null | undefined;
    login: string | null | undefined;
}): JSX.Element => {
    // if (avatar) {
       // const imageUrl = `https://ya-praktikum.tech/api/v2/resources${avatar}`;
       // return <img className={styles.avatar} src={imageUrl} alt="Avatar" />;
    // }
    return <div className={styles.avatar}>{login ? login![0] : "B"}</div>;
};
