import { CanvasCtx } from '../types';

export interface DrawMiss {
    /** Контекст канваса */
    ctx: CanvasCtx;
    /** Координата по горизонтали */
    x: number;
    /** Координата по вертикали */
    y: number;
    /** Размер ячейки в пикселях */
    size: number;
    /** Цвет обводки */
    strokeColor?: string;
}

export const drawMiss = ({
    ctx,
    x,
    y,
    size,
    strokeColor = '#A8D5F2',
}: DrawMiss) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 6, 0, 2 * Math.PI);
    ctx.stroke();
};
