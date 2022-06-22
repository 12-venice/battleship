export interface drawHit {
    /** Контекст канваса */
    ctx: CanvasRenderingContext2D;
    /** Координата по горизонтали */
    x: number;
    /** Координата по вертикали */
    y: number;
    /** Картинка попадания */
    fire: HTMLImageElement;
    /** Размер клетки */
    cellSize: number;
}

export const drawHit = ({ ctx, x, y, fire, cellSize }: drawHit) => {
    ctx.drawImage(fire, x - 1, y - 1, cellSize, cellSize);
};
