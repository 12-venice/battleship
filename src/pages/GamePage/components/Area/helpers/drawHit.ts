// @ts-nocheck
import fireImg from 'images/game/fire.png';
import { CanvasCtx } from '../types';

export interface drawHit {
    /** Контекст канваса */
    ctx: CanvasCtx;
    /** Координата по горизонтали */
    x: number;
    /** Координата по вертикали */
    y: number;
}

export const drawHit = ({ ctx, x, y }: drawHit) => {
    const width = 34;
    const height = 33;
    const image = new Image(width, height);
    image.src = fireImg;
    image.onload = () => {
        ctx.drawImage(image, x + 2, y + 2);
    };
};
