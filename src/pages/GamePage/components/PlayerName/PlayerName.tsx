import cn from 'classnames';
import styles from './PlayerName.scss';
import { Props } from './types';

export const PlayerName = ({
    avatarSrc,
    avatarPosition = 'left',
    name,
}: Props) => (
    <div className={styles.player__container}>
        <div
            className={cn(styles.player__flex, {
                [styles.avatarLeft]: avatarPosition === 'right',
            })}
        >
            {avatarSrc ? (
                <div className={styles.player__avatar}>
                    <img src={avatarSrc} alt="" />
                </div>
            ) : (
                <div className={styles.player__avatar}>
                    <p className={styles.nameCharacter}>{name.charAt(0)}</p>
                </div>
            )}
            <p className={styles.player__name}>{name}</p>
        </div>
    </div>
);
