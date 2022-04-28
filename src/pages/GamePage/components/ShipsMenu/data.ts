/** отступ между кораблями */
export const MARGIN = 9;
/** ширина картинок кораблей */
export const IMG_WIDTH = 50;
/** ширина контейнера с кораблями и отступами */
export const CONTAINER_WIDTH = IMG_WIDTH * 8 + MARGIN * 6;
/** высота картинки с однопалубной лодкой */
export const SHIP_1_HEIGHT = 50;
/** высота картинки с четырехпалубной лодкой */
export const SHIP_4_HEIGHT = 200;
/** высота контейнера с кораблями и отступами */
export const CONTAINER_HEIGHT = SHIP_4_HEIGHT;

/** моковые данные для тестов */
export const shipsData = [
    { id: '1', type: 4, visible: true },
    { id: '2', type: 3, visible: true },
    { id: '3', type: 3, visible: true },
    { id: '4', type: 2, visible: true },
    { id: '5', type: 2, visible: true },
    { id: '6', type: 2, visible: true },
    { id: '7', type: 1, visible: true },
    { id: '8', type: 1, visible: true },
    { id: '9', type: 1, visible: true },
    { id: '10', type: 1, visible: true },
];
