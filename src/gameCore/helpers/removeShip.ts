import { MatrixCell } from 'src/gameCore/types';

const removeShipFromSquadron = ({ squadron, name }) =>
    Object.fromEntries(
        Object.entries(squadron).filter(([shipName]) => shipName !== name),
    );

const removeShipFromMatrix = ({ matrix, shipDecks }) => {
    const newMatrix = [...matrix];
    shipDecks.forEach(([x, y]) => {
        newMatrix[x][y] = MatrixCell.empty;
    });
    return newMatrix;
};

export const removeShip = ({ matrix, squadron, name }) => {
    if (!squadron[name]) {
        return { matrix, squadron };
    }

    return {
        matrix: removeShipFromMatrix({
            matrix,
            shipDecks: squadron[name].arrDecks,
        }),
        squadron: removeShipFromSquadron({ squadron, name }),
    };
};
