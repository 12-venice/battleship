import { MatrixCell } from 'src/gameCore/Field/types';
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

    if (matrix) {
        matrix.forEach((arrRow, y) => {
            arrRow.forEach((cellValue, x) => {
                // отрисовка ячейки
                if ([MatrixCell.empty, MatrixCell.deck].includes(cellValue)) {
                    drawCell({
                        ctx,
                        x: x * cellSize,
                        y: y * cellSize,
                        size: cellSize - padding,
                        radius,
                        fillColor,
                    });
                }

                // отрисовка промаха
                if (MatrixCell.miss === cellValue) {
                    drawMiss({
                        ctx,
                        x: x * cellSize,
                        y: y * cellSize,
                        size: cellSize - padding,
                    });
                }

                // собираем попадания в массив для отрисовки над кораблями
                if (MatrixCell.hit === cellValue) {
                    hitCoordinates.push([x, y]);
                }
            });
        });
    }

    // отрисовка кораблей
    if (ships?.length) {
        ships.forEach(({ x, y, deckCount, isHorizontal }) => {
            drawShip({
                ctx,
                x: x * cellSize,
                y: y * cellSize,
                type: deckCount,
                isHorizontal,
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
