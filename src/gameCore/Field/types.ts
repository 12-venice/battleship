export enum MatrixCell {
    /** Пустая клетка */
    empty = 0,
    /** Палуба корабля */
    deck = 1,
    /** Попадание */
    hit = 2,
    /** Промах */
    miss = 3,
}

export type Matrix =
    | MatrixCell.empty
    | MatrixCell.deck
    | MatrixCell.hit
    | MatrixCell.miss[][];

export type DeckCount = 1 | 2 | 3 | 4;

export enum ShipType {
    fourDeck = 'fourDeck',
    tripleDeck = 'tripleDeck',
    doubleDeck = 'doubleDeck',
    singleDeck = 'singleDeck',
}

export enum ShipDirection {
    horizontal,
    vertical,
}

/** тип корабля */
export type TShipsType =
    | ShipType.fourDeck
    | ShipType.tripleDeck
    | ShipType.doubleDeck
    | ShipType.singleDeck;

/** объект с данными кораблей */
export type IShipData = {
    [key in TShipsType]: {
        /** кол-во кораблей данного типа */
        shipCount: 1 | 2 | 3 | 4;
        /** кол-во палуб у корабля данного типа */
        deckCount: 1 | 2 | 3 | 4;
    };
};

/** Координаты всех четырёх углов игрового поля относительно
 * окна, с учётом возможной прокрутки по вертикали */
export type FieldPosition = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
