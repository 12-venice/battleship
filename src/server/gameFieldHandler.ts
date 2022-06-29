// @ts-nocheck
import { MatrixCell } from 'src/gameCore/types';

export function gameFieldHandler(playerField, opponentField) {
    function handlerChangePlayerField({ matrix, squadron }) {
        const ships = Object.entries(squadron).map(
            ([shipName, { arrDecks, x, y, kx, hits }]) => ({
                id: shipName,
                deckCount: arrDecks.length,
                x,
                y,
                isHorizontal: !kx,
                isRip: hits === arrDecks.length,
            }),
        );
        return { matrix, ships };
    }
    function handlerChangeOpponentField({ matrix, squadron }) {
        const currentMatrix = matrix.map((row) =>
            row.map((cell) =>
                (cell === MatrixCell.deck ? MatrixCell.empty : cell),
            ),
        );

        const ships = Object.entries(squadron)
            .filter(([, { arrDecks, hits }]) => hits === arrDecks.length)
            .map(([shipName, { arrDecks, x, y, kx, hits }]) => ({
                id: shipName,
                deckCount: arrDecks.length,
                x,
                y,
                isHorizontal: !kx,
                isRip: hits === arrDecks.length,
            }));
        return { matrix: currentMatrix, ships };
    }
    return {
        playerField: handlerChangePlayerField(playerField),
        opponentField: handlerChangeOpponentField(opponentField),
    };
}
