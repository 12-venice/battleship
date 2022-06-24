import type { Props } from '../types';

type DrawCell = {
    /** Контекст канваса */
    ctx: CanvasRenderingContext2D;
    /** Координата по горизонтали */
    x: number;
    /** Координата по вертикали */
    y: number;
    /** Размер ячейки в пикселях */
    size: number;
    /** Радиус скругления ячейки */
    radius: number;
} & Pick<Props, 'fillColor'>;

export const drawCell = ({
    ctx,
    x,
    y,
    size,
    radius,
    fillColor = '#ffffff',
}: DrawCell) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size - radius, y);
    ctx.arcTo(x + size, y, x + size, y + radius, radius);
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
    ctx.lineTo(x + radius, y + size);
    ctx.arcTo(x, y + size, x, y + size - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
};
