export interface drawHit {
    /** Контекст канваса */
    ctx: CanvasRenderingContext2D;
    /** Координата по горизонтали */
    x: number;
    /** Координата по вертикали */
    y: number;
    /** Картинка попадания */
    fire: HTMLImageElement;
}

export const drawHit = ({ ctx, x, y, fire }: drawHit) => {
    ctx.drawImage(fire, x + 2, y + 2);
};
