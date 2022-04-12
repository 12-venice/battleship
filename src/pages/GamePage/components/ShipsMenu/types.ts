export type Props = {
    ships: {
        /** уникальный ключ */
        id: string;
        /** количество палуб */
        type: 4 | 3 | 2 | 1;
        /** показать/скрыть */
        visible: boolean;
    }[];
};
