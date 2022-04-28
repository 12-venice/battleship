export const emptyMatrix = new Array(10).fill(new Array(10).fill(0));

/** Пример игрового поля. Для тестов */
export const gameMatrix = [
    [1, 3, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
];

/** Пример данных для отрисовки кораблей. Для тестов */
export const gameShips = [
    {
        deckCount: 4,
        x: 2,
        y: 2,
        isHorizontal: true,
    },
    {
        deckCount: 3,
        x: 7,
        y: 1,
    },
    {
        deckCount: 3,
        x: 4,
        y: 1,
        isHorizontal: true,
    },
    {
        deckCount: 2,
        x: 1,
        y: 8,
    },
    {
        deckCount: 2,
        x: 5,
        y: 5,
        isHorizontal: true,
    },
    {
        deckCount: 2,
        x: 7,
        y: 8,
    },
    {
        deckCount: 1,
        x: 8,
        y: 4,
        isHorizontal: true,
    },
    {
        deckCount: 1,
        x: 9,
        y: 9,
    },
    {
        deckCount: 1,
        x: 0,
        y: 2,
        isHorizontal: true,
    },
    {
        deckCount: 1,
        x: 0,
        y: 0,
        isHorizontal: true,
    },
];
