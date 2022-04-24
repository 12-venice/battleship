import { Ship } from '../Ship';
import { getRandom } from '../helpers/getRandom';
import { IShipData, ShipType } from './types';

export class Field {
    private SHIP_DATA: IShipData = {
        [ShipType.fourDeck]: { shipCount: 1, deckCount: 4 },
        [ShipType.tripleDeck]: { shipCount: 2, deckCount: 3 },
        [ShipType.doubleDeck]: { shipCount: 3, deckCount: 2 },
        [ShipType.singleDeck]: { shipCount: 4, deckCount: 1 },
    };

    /** создаём пустой объект, куда будем заносить данные по каждому созданному кораблю */
    squadron = {};

    /** двумерный массив, в который заносятся координаты кораблей, а в ходе
     * морского боя, координаты попаданий, промахов и заведомо пустых клеток */
    matrix;

    isPlayer = false;

    constructor({
        isPlayer,
    }: {
        field?: HTMLCanvasElement;
        isPlayer?: boolean;
        handlerUpdate?: () => void;
    }) {
        if (isPlayer) this.isPlayer = isPlayer;
        this.matrix = Field.createMatrix();
        this.squadron = {};
    }

    getMatrix() {
        return this.matrix;
    }

    getSquadron() {
        return this.squadron;
    }

    cleanField() {
        // удаляем всё элементы объекта эскадры
        this.squadron = {};
        // заполняем матрицу игрового поля нулями
        this.matrix = Field.createMatrix();
    }

    randomLocationShips() {
        Object.entries(this.SHIP_DATA).map(
            ([type, { shipCount, deckCount }]) => {
                for (let i = 0; i < shipCount; i++) {
                    // получаем координаты первой палубы и направление расположения палуб
                    const options = this.getCoordsDecks(deckCount);
                    // кол-во палуб
                    options.decks = deckCount;
                    // имя корабля, понадобится в дальнейшем для его идентификации
                    options.shipname = type + String(i + 1);
                    // создаём экземпляр корабля со свойствами, указанными в
                    // объекте options
                    const ship = new Ship(this, options);
                    ship.createShip();
                }
            },
        );
    }

    static createMatrix() {
        return [...Array(10)].map(() => Array(10).fill(0));
    }

    getCoordsDecks(decks: 1 | 2 | 3 | 4): {
        x: number;
        y: number;
        kx: number;
        ky: number;
    } {
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

        const result = this.checkLocationShip(obj, decks);
        // если координаты невалидны, снова запускаем функцию
        if (!result) return this.getCoordsDecks(decks);
        return obj;
    }

    /** проверяем валидность координат всех палуб корабля */
    checkLocationShip(obj, decks) {
        let { x, y, kx, ky, fromX, toX, fromY, toY } = obj;

        // формируем индексы, ограничивающие двумерный массив по оси X (строки)
        // если координата 'x' равна нулю, то это значит, что палуба расположена в самой
        // верхней строке, т. е. примыкает к верхней границе и началом цикла будет строка
        // с индексом 0, в противном случае, нужно начать проверку со строки с индексом
        // на единицу меньшим, чем у исходной, т.е. находящейся выше исходной строки
        fromX = x === 0 ? x : x - 1;
        // если условие истинно - это значит, что корабль расположен вертикально и его
        // последняя палуба примыкает к нижней границе игрового поля
        // поэтому координата 'x' последней палубы будет индексом конца цикла
        if (x + kx * decks === 10 && kx === 1) toX = x + kx * decks;
        // корабль расположен вертикально и между ним и нижней границей игрового поля
        // есть, как минимум, ещё одна строка, координата этой строки и будет
        // индексом конца цикла
        else if (x + kx * decks < 10 && kx === 1) toX = x + kx * decks + 1;
        // корабль расположен горизонтально вдоль нижней границы игрового поля
        else if (x === 9 && kx === 0) toX = x + 1;
        // корабль расположен горизонтально где-то по середине игрового поля
        else if (x < 9 && kx === 0) toX = x + 2;

        // формируем индексы начала и конца выборки по столбцам
        // принцип такой же, как и для строк
        fromY = y === 0 ? y : y - 1;
        if (y + ky * decks === 10 && ky === 1) toY = y + ky * decks;
        else if (y + ky * decks < 10 && ky === 1) toY = y + ky * decks + 1;
        else if (y === 9 && ky === 0) toY = y + 1;
        else if (y < 9 && ky === 0) toY = y + 2;

        if (toX === undefined || toY === undefined) return false;

        // отфильтровываем ячейки, получившегося двумерного массива,
        // содержащие 1, если такие ячейки существуют - возвращаем false
        if (
            this.matrix
                .slice(fromX, toX)
                .filter((arr) => arr.slice(fromY, toY).includes(1)).length > 0
        ) {
            return false;
        }

        return true;
    }
}
