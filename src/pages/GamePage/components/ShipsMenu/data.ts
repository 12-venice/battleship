import { ShipType } from 'src/gameCore/types';

/** отступ между кораблями */
export const MARGIN = 9;
/** ширина картинок кораблей */
export const IMG_WIDTH = 40;
/** ширина контейнера с кораблями и отступами */
export const CONTAINER_WIDTH = IMG_WIDTH * 8 + MARGIN * 6;
/** высота картинки с однопалубной лодкой */
export const SHIP_1_HEIGHT = 50;
/** высота картинки с четырехпалубной лодкой */
export const SHIP_4_HEIGHT = 170;
/** высота контейнера с кораблями и отступами */
export const CONTAINER_HEIGHT = SHIP_4_HEIGHT;

/** моковые данные для тестов */
export const shipsData = [
    { id: `${ShipType.fourDeck}40`, type: 4, visible: true },
    { id: `${ShipType.tripleDeck}30`, type: 3, visible: true },
    { id: `${ShipType.tripleDeck}31`, type: 3, visible: true },
    { id: `${ShipType.doubleDeck}20`, type: 2, visible: true },
    { id: `${ShipType.doubleDeck}21`, type: 2, visible: true },
    { id: `${ShipType.doubleDeck}22`, type: 2, visible: true },
    { id: `${ShipType.singleDeck}10`, type: 1, visible: true },
    { id: `${ShipType.singleDeck}11`, type: 1, visible: true },
    { id: `${ShipType.singleDeck}12`, type: 1, visible: true },
    { id: `${ShipType.singleDeck}13`, type: 1, visible: true },
];
