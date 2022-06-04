import { RefObject } from 'react';
import type { Matrix, DeckCount } from 'src/gameCore/types';

export type CanvasCtx = CanvasRenderingContext2D;

export type Ship = {
    /** Уникальный ключ */
    id: string;
    /** Количество палуб */
    deckCount: DeckCount;
    /** Координата по горизонтали */
    x: number;
    /** Координата по вертикали */
    y: number;
    /** Направление корабля */
    isHorizontal?: boolean;
};

export type Props = {
    /** Ширина игрового поля. От него зависит размер ячеек */
    areaWidth: number;
    /** Ссылка на ref с полем в canvas */
    canvasRef?: RefObject<HTMLCanvasElement>;
    /** Матрица с состояниями ячеек */
    matrix?: Matrix;
    /** Расположение кораблей */
    ships?: Ship[];
    /** Цвет заливки ячеек. По умолчанию белый */
    fillColor?: string;
};
