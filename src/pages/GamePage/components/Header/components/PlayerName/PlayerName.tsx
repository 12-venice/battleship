// @ts-nocheck
import cn from 'classnames';
import { Avatar } from 'src/components/Avatar';
import styles from './PlayerName.scss';
import { Props } from './types';

export const PlayerName = ({ user, avatarPosition = 'left' }: Props) => (
    <div className={styles.player__container}>
        <div
            className={cn(styles.player__flex, {
                [styles.avatarLeft]: avatarPosition === 'right',
            })}
        >
            <Avatar avatar={user?.avatar} login={user?.login} />
            <p className={styles.player__name}>
                {user?.display_name ?? 'Player'}
            </p>
        </div>
    </div>
);
