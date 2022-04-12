import { useMemo } from 'react';
import { getCurrentShips } from './helpers/getCurrentShips';
import { CONTAINER_WIDTH, CONTAINER_HEIGHT } from './data';
import styles from './ShipsMenu.scss';
import type { Props } from './types';

export const ShipsMenu = ({ ships }: Props) => {
    const currentShips = useMemo(() => getCurrentShips(ships), [ships]);

    return (
        <div
            className={styles.container}
            style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
        >
            {currentShips.map(({ id, src, bottom, left }) => (
    <img
                    alt=""
                    key={id}
                    data-test-id={id}
                    data-ship-id={id}
                    src={src}
                    style={{ bottom, left }}
                />
            ))}
        </div>
    );
};
