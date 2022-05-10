import { getRandom, checkLocationShip } from 'src/gameCore/helpers';
import type { Matrix } from 'src/gameCore/types';

export const getCoordsDecks = ({
    decks,
    matrix,
}: {
    decks: 1 | 2 | 3 | 4;
    matrix: Matrix;
}): {
    x: number;
    y: number;
    kx: number;
    ky: number;
} => {
    // получаем коэффициенты определяющие направление расположения корабля
    // kx == 0 и ky == 1 — корабль расположен горизонтально,
    // kx == 1 и ky == 0 - вертикально.
    const randomCell = getRandom(9);
    const randomCellWithoutDecks = getRandom(10 - decks);
    const kx = getRandom(1);
    const ky = kx === 0 ? 1 : 0;

    // в зависимости от направления расположения, генерируем
    // начальные координаты
    const x = kx ? randomCellWithoutDecks : randomCell;
    const y = ky ? randomCellWithoutDecks : randomCell;

    const obj = {
        x,
        y,
        kx,
        ky,
    };

    const result = checkLocationShip({ ...obj, decks, matrix });
    // если координаты невалидны, снова запускаем функцию
    if (!result) return getCoordsDecks({ decks, matrix });
    return obj;
};
