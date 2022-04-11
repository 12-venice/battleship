// todo: разобраться с импортом
//  Ошибка: Unable to resolve path to module 'images/ships/ship1.png'
/* eslint-disable */
import ship1Img from 'images/ships/ship1.png';
import ship2Img from 'images/ships/ship2.png';
import ship3Img from 'images/ships/ship3.png';
import ship4Img from 'images/ships/ship4.png';
/* eslint-enable */
import styles from './ShipsMenu.scss';
import {
    CONTAINER_WIDTH,
    CONTAINER_HEIGHT,
    IMG_WIDTH,
    MARGIN,
    SHIP_1_HEIGHT,
} from './data';
import type { Props } from './types';

export const ShipsMenu = ({ ships }: Props) => (
    <div
        className={styles.container}
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
    >
        {ships.map(({ id, type, visible }, index) => {
            if (visible) return '';

            let src = '';
            if (type === 1) src = ship1Img;
            if (type === 2) src = ship2Img;
            if (type === 3) src = ship3Img;
            if (type === 4) src = ship4Img;

            let bottom = 0;
            let left = (IMG_WIDTH + MARGIN) * index;

            // рендер однопалубных кораблей друг над другом
            if (index > 7) {
                bottom = MARGIN + SHIP_1_HEIGHT;
                left = (IMG_WIDTH + MARGIN) * (index - 2);
            }

            return (
                <img
                    alt=""
                    key={id}
                    data-test-id={id}
                    data-ship-id={id}
                    src={src}
                    style={{ bottom, left }}
                />
            );
        })}
    </div>
);
