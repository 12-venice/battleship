/* eslint-disable indent */
// @ts-nocheck
import { Field } from 'src/gameCore/Field';
import { BotField } from 'src/gameCore/BotField';
import {
    getCoordinates,
    getRandomLocationShipsAndMatrix,
} from 'src/gameCore/helpers';
import { MatrixCell } from 'src/gameCore/types';
import {
    activeFieldIds,
    statisticsFields,
} from 'src/gameCore/Controller/types';

const mockHandlerChangeField = ({ matrix, squadron }) => {};
const mockHandlerGameOver = () => {};
export const mockStatistics = () => [
    { label: 'HITS', [activeFieldIds.player]: 0, [activeFieldIds.opponent]: 0 },
    { label: 'MISS', [activeFieldIds.player]: 0, [activeFieldIds.opponent]: 0 },
    {
        label: 'ALIVE',
        [activeFieldIds.player]: 10,
        [activeFieldIds.opponent]: 10,
    },
    {
        label: 'DESTROYED',
        [activeFieldIds.player]: 0,
        [activeFieldIds.opponent]: 0,
    },
];

export const mockAccount = () => [0, 0];

export class Controller {
    opponentField;

    player;

    opponent;

    handlerChangePlayerField;

    handlerChangeOpponentField;

    shotQueue;

    handlerGameOver;

    statistics;

    account;

    bonusCount;

    constructor({
        opponentFieldRef,
        playerSquadron,
        playerMatrix,
        handlerChangePlayerField,
        handlerChangeOpponentField,
        handlerGameOver,
    }) {
        this.opponentField = opponentFieldRef;
        this.handlerChangePlayerField =
            handlerChangePlayerField || mockHandlerChangeField;
        this.handlerChangeOpponentField =
            handlerChangeOpponentField || mockHandlerChangeField;

        this.player = new Field({
            matrix: playerMatrix,
            squadron: playerSquadron,
        });
        this.opponent = new BotField(getRandomLocationShipsAndMatrix());

        this.shotQueue = activeFieldIds.player;
        this.handlerGameOver = handlerGameOver || mockHandlerGameOver;
        this.statistics = mockStatistics();
        this.account = mockAccount();
        this.bonusCount = 0;
        this.onChangeField();
    }

    getStatistics() {
        return this.statistics;
    }

    getShotQueue() {
        return this.shotQueue;
    }

    getAccount() {
        return this.account;
    }

    getBonusCount() {
        return this.bonusCount;
    }

    resetBonusCount() {
        this.bonusCount = 0;
    }

    nextQueue() {
        this.onChangeField();
        if (this.shotQueue === activeFieldIds.player) {
            this.opponent.nextShot(this.makeShot.bind(this));
        }

        this.shotQueue =
            this.shotQueue === activeFieldIds.player
                ? activeFieldIds.opponent
                : activeFieldIds.player;
    }

    incrementStatistics(player: activeFieldIds, element: statisticsFields) {
        this.statistics[element][player] += 1;
    }

    incrementBonusCount() {
        this.bonusCount += 1;
    }

    incrementAccount(player: activeFieldIds, value: number) {
        this.account[player] += value;
    }

    updateStateShips(player: activeFieldIds, squadron) {
        const ripShipsCount = Object.entries(squadron).filter(
            ([, { arrDecks, hits }]) => hits === arrDecks.length,
        ).length;
        if (player === activeFieldIds.player) {
            this.statistics[statisticsFields.alive][activeFieldIds.opponent] =
                10 - ripShipsCount;
            this.statistics[statisticsFields.destroyed][
                activeFieldIds.opponent
            ] = ripShipsCount;
        } else {
            this.statistics[statisticsFields.alive][activeFieldIds.player] =
                10 - ripShipsCount;
            this.statistics[statisticsFields.destroyed][activeFieldIds.player] =
                ripShipsCount;
        }
    }

    handlerPlayerShot(e) {
        if (this.shotQueue === activeFieldIds.player) {
            const [x, y] = this.transformCoordsInMatrix(e);
            this.makeShot({ x, y });
        }
    }

    checkIsRip(coords) {
        const squadron = this.player.getSquadron();
        const result = Object.entries(squadron).filter(([shipId, shipData]) => {
            const r = shipData.arrDecks.filter(
                (c) => c[0] === coords[0] && c[1] === coords[1],
            );
            if (r.length > 0) {
                return true;
            }
            return false;
        });
        if (result[0][1].hits + 1 === result[0][1].type) {
            return true;
        }
        return false;
    }

    makeShot({ x, y }) {
        const activeField =
            this.shotQueue === activeFieldIds.player
                ? this.opponent
                : this.player;
        const v = activeField.matrix[x][y];
        switch (v) {
            // промах
            case MatrixCell.empty:
                if (this.shotQueue === activeFieldIds.opponent) {
                    this.opponent.updateFieldMap([x, y], MatrixCell.miss);
                }
                this.miss({ x, y, activeField });
                break;
            // попадание
            case MatrixCell.deck:
                if (this.shotQueue === activeFieldIds.opponent) {
                    this.opponent.updateFieldMap(
                        [x, y],
                        MatrixCell.hit,
                        this.checkIsRip([x, y]),
                    );
                }
                this.hit({ x, y, activeField });
                break;
            default:
                break;
        }
    }

    hit({ x, y, activeField }) {
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

        this.incrementStatistics(this.shotQueue, statisticsFields.hits);
        this.incrementBonusCount();
        this.incrementAccount(this.shotQueue, this.getBonusCount());
        this.updateStateShips(this.shotQueue, activeField.getSquadron());

        this.onChangeField();

        if (
            Object.entries(activeField.getSquadron()).every(
                ([shipId, shipData]) => shipData.type === shipData.hits,
            )
        ) {
            this.incrementAccount(
                this.shotQueue,
                this.getAccount()[this.shotQueue],
            );
            this.handlerGameOver(this.shotQueue);
        }

        if (this.shotQueue === activeFieldIds.opponent) {
            this.opponent.setHitCoords({ x, y });
            this.opponent.nextShot(this.makeShot.bind(this));
        }
    }

    miss({ x, y, activeField }) {
        const matrix = activeField.getMatrix();
        matrix[x][y] = MatrixCell.miss;
        activeField.setMatrix(matrix);

        this.incrementStatistics(this.shotQueue, statisticsFields.miss);
        this.resetBonusCount();
        this.updateStateShips(this.shotQueue, activeField.getSquadron());

        this.onChangeField();

        if (this.shotQueue === activeFieldIds.player) {
            this.opponent.nextShot(this.makeShot.bind(this));
        } else {
            this.opponent.setMissCoords({ x, y });
        }

        this.shotQueue =
            this.shotQueue === activeFieldIds.player
                ? activeFieldIds.opponent
                : activeFieldIds.player;
    }

    onChangeField() {
        this.handlerChangeOpponentField({
            matrix: this.opponent.getMatrix(),
            squadron: this.opponent.getSquadron(),
        });

        this.handlerChangePlayerField({
            matrix: this.player.getMatrix(),
            squadron: this.player.getSquadron(),
        });
    }

    transformCoordsInMatrix(areaEvent) {
        const areaCoords = getCoordinates(areaEvent.target);
        const cellSize = areaEvent.target.width / 10;
        const x = Math.trunc((areaEvent.pageY - areaCoords.top) / cellSize);
        const y = Math.trunc((areaEvent.pageX - areaCoords.left) / cellSize);
        return [x, y];
    }
}
