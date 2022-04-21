import cn from 'classnames';
import styles from './PlayerName.scss';
import { Props } from './types';

export const PlayerName = ({
    avatarSrc,
    avatarPosition = 'left',
    name,
}: Props) => (
    <div className={styles.container}>
        <div
            className={cn(styles.flex, {
                [styles.avatarLeft]: avatarPosition === 'right',
            })}
        >
            {avatarSrc ? (
                <div className={styles.avatar}>
                    <img
                        src={`https://ya-praktikum.tech/api/v2/resources${avatarSrc}`}
                        alt="Player avatar"
                    />
                </div>
            ) : (
                <div className={styles.avatar}>
                    <p className={styles.nameCharacter}>{name.charAt(0)}</p>
                </div>
            )}
            <p className={styles.name}>{name}</p>
        </div>
    </div>
);
