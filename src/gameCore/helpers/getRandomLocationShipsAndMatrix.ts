import { Ship } from 'src/gameCore/Ship';
import { SHIP_DATA } from 'src/gameCore/config';
import { MatrixCell } from 'src/gameCore/types';
import { getCoordsDecks, getEmptyMatrix } from 'src/gameCore/helpers';

export const getRandomLocationShipsAndMatrix = () => {
    const shipFactory = new Ship();
    const matrix = getEmptyMatrix();
    let squadron = {};

    Object.entries(SHIP_DATA).forEach(([type, { shipCount, deckCount }]) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < shipCount; i++) {
            const options = getCoordsDecks({ decks: deckCount, matrix });
            const ship = shipFactory.createShip({
                ...options,
                decks: deckCount,
            });
            squadron = {
                ...squadron,
                [`${type}${deckCount}${i}`]: ship,
            };
            ship.arrDecks.forEach(([x, y]) => {
                matrix[x][y] = MatrixCell.deck;
            });
        }
    });

    return { squadron, matrix };
};
