// @ts-nocheck
export class Ship {
    // eslint-disable-next-line class-methods-use-this
    createShip({ x, y, kx, ky, decks }) {
        const arrDecks = [];
        let k = 0;

        while (k < decks) {
            // записываем координаты корабля в двумерный массив игрового поля
            // теперь наглядно должно быть видно, зачем мы создавали два
            // коэффициента направления палуб
            // если коэффициент равен 1, то соответствующая координата будет
            // увеличиваться при каждой итерации
            // если равен нулю, то координата будет оставаться неизменной
            // таким способом мы очень сократили и унифицировали код
            const i = x + k * kx;
            const j = y + k * ky;

            // записываем координаты палубы
            arrDecks.push([i, j]);
            // eslint-disable-next-line no-plusplus
            k++;
        }

        // заносим информацию о созданном корабле в объект эскадры
        return {
            arrDecks,
            hits: 0,
            type: decks,
            x,
            y,
            kx,
            ky,
        };
    }
}
