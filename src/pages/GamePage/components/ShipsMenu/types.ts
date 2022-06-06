import { DragEvent } from 'react';

export type DragImageEvent = DragEvent<HTMLImageElement>;

export type Props = {
    imgWidth: number;
    ships: {
        /** уникальный ключ */
        id: string;
        /** количество палуб */
        type: 4 | 3 | 2 | 1;
        /** показать/скрыть */
        visible: boolean;
    }[];
    /** Начало перемещения */
    onDragStart?: (e: DragImageEvent) => void;
    /** Попадание блока в какую то область */
    onDragEnter?: (e: DragImageEvent) => void;
    /** Прекращение перемещения. Срабатывает раньше события dragend */
    onDrop?: (e: DragImageEvent) => void;
    /** Прекращение перемещения */
    onDragEnd?: (e: DragImageEvent) => void;
    /** Перемещение блока по окну */
    onDragOver?: (e: DragImageEvent) => void;
};
