interface Ship {
    /** уникальный ключ */
    id: string;
    /** количество палуб */
    type: 4 | 3 | 2 | 1;
    /** показать/скрыть */
    visible: boolean;
}

export type Props = {
    ships: Ship[];
};
