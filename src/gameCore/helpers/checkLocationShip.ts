/** проверяем валидность координат всех палуб корабля */
export const checkLocationShip = ({
    x,
    y,
    kx,
    ky,
    toX,
    toY,
    decks,
    matrix,
}) => {
    let currentToX = toX;
    let currentToY = toY;
    // формируем индексы, ограничивающие двумерный массив по оси X (строки)
    // если координата 'x' равна нулю, то это значит, что палуба расположена в самой
    // верхней строке, т. е. примыкает к верхней границе и началом цикла будет строка
    // с индексом 0, в противном случае, нужно начать проверку со строки с индексом
    // на единицу меньшим, чем у исходной, т.е. находящейся выше исходной строки
    const fromX = x === 0 ? x : x - 1;
    // если условие истинно - это значит, что корабль расположен вертикально и его
    // последняя палуба примыкает к нижней границе игрового поля
    // поэтому координата 'x' последней палубы будет индексом конца цикла
    if (x + kx * decks === 10 && kx === 1) currentToX = x + kx * decks;
    // корабль расположен вертикально и между ним и нижней границей игрового поля
    // есть, как минимум, ещё одна строка, координата этой строки и будет
    // индексом конца цикла
    else if (x + kx * decks < 10 && kx === 1) currentToX = x + kx * decks + 1;
    // корабль расположен горизонтально вдоль нижней границы игрового поля
    else if (x === 9 && kx === 0) currentToX = x + 1;
    // корабль расположен горизонтально где-то по середине игрового поля
    else if (x < 9 && kx === 0) currentToX = x + 2;

    // формируем индексы начала и конца выборки по столбцам
    // принцип такой же, как и для строк
    const fromY = y === 0 ? y : y - 1;
    if (y + ky * decks === 10 && ky === 1) currentToY = y + ky * decks;
    else if (y + ky * decks < 10 && ky === 1) currentToY = y + ky * decks + 1;
    else if (y === 9 && ky === 0) currentToY = y + 1;
    else if (y < 9 && ky === 0) currentToY = y + 2;

    if (currentToX === undefined || currentToY === undefined) return false;

    // отфильтровываем ячейки, получившегося двумерного массива,
    // содержащие 1, если такие ячейки существуют - возвращаем false
    return (
        matrix
            .slice(fromX, currentToX)
            .filter((arr) => arr.slice(fromY, currentToY).includes(1))
            .length === 0
    );
};
