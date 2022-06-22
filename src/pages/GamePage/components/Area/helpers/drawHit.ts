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
    ctx.drawImage(fire, x + 2, y + 2, cellSize * 0.8, cellSize * 0.8);
};
