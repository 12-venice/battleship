import { shipsSrcMap } from 'src/pages/GamePage/data';
import {
    IMG_WIDTH,
    MARGIN,
    SHIP_1_HEIGHT,
} from 'src/pages/GamePage/components/ShipsMenu/data';
import type { Props } from '../types';

export const getCurrentShips = ({
    ships,
    imgWidth = IMG_WIDTH,
}: {
    ships: Props['ships'];
}) =>
    ships.reduce((acc, { id, type, visible }, index) => {
        if (!visible) return acc;

        const src = shipsSrcMap.has(type) ? shipsSrcMap.get(type) : '';

        let bottom = 0;
        let left = (imgWidth + MARGIN) * index;

        // рендер однопалубных кораблей друг над другом
        if (index > 7) {
            bottom = MARGIN + SHIP_1_HEIGHT;
            left = (imgWidth + MARGIN) * (index - 2);
        }

        acc.push({
            id,
            type,
            src,
            bottom,
            left,
            width: imgWidth,
        });

        return acc;
    }, []);
