import styles from './Avatar.scss';

export const Avatar = ({ login }: { login: string }): JSX.Element => (
    <div className={styles.avatar}>{login ? login[0] : 'P'}</div>
);
