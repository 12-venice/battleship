// @ts-nocheck
import { MatrixCell } from 'src/gameCore/types';
import { drawCell } from './drawCell';
import { drawMiss } from './drawMiss';
import { drawHit } from './drawHit';
import { drawShip } from './drawShip';
import type { Props, CanvasCtx } from '../types';

export interface DrawMatrix extends Props {
    /** Контекст канваса */
    ctx: CanvasCtx;
}

export const drawMatrix = ({
    ctx,
    areaWidth,
    fillColor,
    matrix,
    ships,
}: DrawMatrix) => {
    const radius = 8;
    const padding = 2;
    const areaSize = 10;
    const cellSize = areaWidth / areaSize;

    const hitCoordinates: [number, number][] = [];

    // очистить весь холст
    ctx.clearRect(0, 0, areaWidth, areaWidth);

    if (matrix) {
        matrix.forEach((arrRow, x) => {
            arrRow.forEach((cellValue, y) => {
                // отрисовка ячейки
                if ([MatrixCell.empty].includes(cellValue)) {
                    drawCell({
                        ctx,
                        x: y * cellSize,
                        y: x * cellSize,
                        size: cellSize - padding,
                        radius,
                        fillColor,
                    });
                }

                // отрисовка промаха
                if (MatrixCell.miss === cellValue) {
                    drawMiss({
                        ctx,
                        x: y * cellSize,
                        y: x * cellSize,
                        size: cellSize - padding,
                    });
                }

                // собираем попадания в массив для отрисовки над кораблями
                if (MatrixCell.hit === cellValue) {
                    hitCoordinates.push([y, x]);
                }
            });
        });
    }

    // отрисовка кораблей
    if (ships?.length) {
        ships.forEach(({ x, y, deckCount, isHorizontal, isRip }) => {
            drawShip({
                ctx,
                x: y * cellSize,
                y: x * cellSize,
                type: deckCount,
                isHorizontal,
                isRip,
                cellSize,
            });
        });
    }

    // отрисовка попаданий
    if (hitCoordinates.length) {
        hitCoordinates.forEach(([x, y]) => {
            drawHit({
                ctx,
                x: x * cellSize,
                y: y * cellSize,
            });
        });
    }
};
