import { shipsSrcMap } from 'src/pages/GamePage/data';
import {
    IMG_WIDTH,
    MARGIN,
    SHIP_1_HEIGHT,
} from 'src/pages/GamePage/components/ShipsMenu/data';
import type { Props } from '../types';

export const getCurrentShips = (ships: Props['ships']) =>
    ships.reduce((acc, { id, type, visible }, index) => {
        if (!visible) return acc;

        const src = shipsSrcMap.has(type) ? shipsSrcMap.get(type) : '';

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
            width: IMG_WIDTH,
        });

        return acc;
    }, []);
