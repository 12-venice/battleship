// @ts-nocheck
/* eslint-disable prettier/prettier */
import { Field } from 'src/gameCore/Field';
import { MatrixCell } from 'src/gameCore/types';
import { activeFieldList, statisticsFields } from './types';

export function gameController(
    createdField,
    invitedField,
    shot: { x: number; y: number },
    queue,
    score,
    bonusScore,
    statistics,
) {
    const createdFieldState = new Field({
        matrix: createdField.matrix,
        squadron: createdField.squadron,
    });
    const invitedFieldState = new Field({
        matrix: invitedField.matrix,
        squadron: invitedField.squadron,
    });
    let bScore = bonusScore;
    const resultStatistics = statistics;
    const resultScore = score;
    let shotQueue = queue;
    let gameOver = false;

    function resetBonusScore() {
        bScore = 0;
    }
    function incrementBonusScore() {
        bScore += 1;
    }
    function incrementScore(player: activeFieldList, value: number) {
        resultScore[player] += value;
    }

    function incrementStatistics(player: activeFieldList, element: statisticsFields) {
        resultStatistics[element][player] += 1;
    }
    function updateStateShips(player: activeFieldList, squadron) {
        const ripShipsCount = Object.entries(squadron).filter(
            ([, { arrDecks, hits }]) => hits === arrDecks.length,
        ).length;
        if (player === activeFieldList.invited) {
            resultStatistics[statisticsFields.alive][activeFieldList.created] =
                10 - ripShipsCount;
            resultStatistics[statisticsFields.destroyed][
                activeFieldList.created
            ] = ripShipsCount;
        } else {
            resultStatistics[statisticsFields.alive][activeFieldList.invited] =
                10 - ripShipsCount;
            resultStatistics[statisticsFields.destroyed][activeFieldList.invited] =
                ripShipsCount;
        }
    }

    function miss({ x, y, activeField }) {
        resetBonusScore();
        incrementStatistics(shotQueue, statisticsFields.miss);
        const matrix = activeField.getMatrix();
        matrix[x][y] = MatrixCell.miss;
        activeField.setMatrix(matrix);
        updateStateShips(shotQueue, activeField.getSquadron());
    }
    function switchQueue() {
        shotQueue =
            shotQueue === activeFieldList.invited
                ? activeFieldList.created
                : activeFieldList.invited;
    }
    function checkGameOver(activeField) {
        if (
            Object.entries(activeField.getSquadron()).every(
                ([shipId, shipData]) => shipData.type === shipData.hits,
            )
        ) {
            if (shotQueue === activeFieldList.invited) {
                incrementScore(activeFieldList.invited, resultScore[activeFieldList.invited]);
            } else {
                incrementScore(activeFieldList.created, resultScore[activeFieldList.created]);
            }
            gameOver = true;
        }
    }
    function hit({ x, y, activeField }) {
        incrementBonusScore();
        incrementScore(shotQueue, bScore);
        incrementStatistics(shotQueue, statisticsFields.hits);
        const matrix = activeField.getMatrix();
        matrix[x][y] = MatrixCell.hit;
        activeField.setMatrix(matrix);

        const squadron = Object.fromEntries(
            Object.entries(activeField.getSquadron()).map(
                ([shipId, shipData]) => {
                    if (
                        shipData.arrDecks.find(
                            ([deckX, deckY]) => deckX === x && deckY === y,
                        )
                    ) {
                        return [
                            shipId,
                            { ...shipData, hits: shipData.hits + 1 },
                        ];
                    }

                    return [shipId, shipData];
                },
            ),
        );
        activeField.setSquadron(squadron);
        updateStateShips(shotQueue, activeField.getSquadron());
    }
    function makeShot({ x, y }) {
        const activeField =
            queue === activeFieldList.invited
                ? createdFieldState
                : invitedFieldState;
        const v = activeField.getMatrix()[x][y];
        switch (v) {
        case MatrixCell.empty:
            miss({ x, y, activeField });
            switchQueue();
            break;
        case MatrixCell.deck:
            hit({ x, y, activeField });
            checkGameOver(activeField);
            break;
        default:
            break;
        }
    }

    makeShot(shot);
    return {
        createdField: {
            matrix: createdFieldState.getMatrix(),
            squadron: createdFieldState.getSquadron(),
        },
        invitedField: {
            matrix: invitedFieldState.getMatrix(),
            squadron: invitedFieldState.getSquadron(),
        },
        queue: shotQueue,
        gameOver,
        score: resultScore,
        bonusScore: bScore,
        statistics: resultStatistics,
    };
}
