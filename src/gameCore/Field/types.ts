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
