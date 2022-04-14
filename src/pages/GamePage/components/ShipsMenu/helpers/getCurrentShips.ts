// надо разобраться с преттиер
/* eslint-disable */
// ошибка в reduce
// @ts-nocheck
import ship1Img from 'images/ships/ship1.png';
import ship2Img from 'images/ships/ship2.png';
import ship3Img from 'images/ships/ship3.png';
import ship4Img from 'images/ships/ship4.png';
import {
    IMG_WIDTH,
    MARGIN,
    SHIP_1_HEIGHT,
} from 'src/pages/GamePage/components/ShipsMenu/data';
import type { Props } from '../types';

const shipsSrc = new Map([
    [1, ship1Img],
    [2, ship2Img],
    [3, ship3Img],
    [4, ship4Img],
]);

export const getCurrentShips = (ships: Props['ships']) =>
    ships.reduce((acc, { id, type, visible }, index) => {
        if (!visible) return acc;

        const src = shipsSrc.has(type) ? shipsSrc.get(type) : '';

        let bottom = 0;
        let left = (IMG_WIDTH + MARGIN) * index;

        // рендер однопалубных кораблей друг над другом
        if (index > 7) {
            bottom = MARGIN + SHIP_1_HEIGHT;
            left = (IMG_WIDTH + MARGIN) * (index - 2);
        }

        acc.push({
            id,
            src,
            bottom,
            left,
        });

        return acc;
    }, []);
