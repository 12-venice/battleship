import { drawCell } from './drawCell';
import type { Props } from '../types';

export interface DrawMatrix extends Props {
    /** Контекст канваса */
    ctx: CanvasRenderingContext2D;
}

export const drawMatrix = ({ ctx, areaWidth, fillColor }: DrawMatrix) => {
    const radius = 8;
    const padding = 2;
    const areaSize = 10;
    const cellSize = areaWidth / areaSize;

    new Array(10).fill(1).forEach((itemX, x) => {
        new Array(10).fill(1).forEach((itemY, y) => {
            drawCell({
                ctx,
                x: x * cellSize,
                y: y * cellSize,
                size: cellSize - padding,
                radius,
                fillColor,
            });
        });
    });
};
