import { Field } from 'src/gameCore/Field';
import { BotField } from 'src/gameCore/BotField';
import {
    getCoordinates,
    getRandomLocationShipsAndMatrix,
} from 'src/gameCore/helpers';
import { MatrixCell } from 'src/gameCore/types';
import { activeFieldIds } from 'src/gameCore/Controller/types';

const mockHandlerChangeField = ({ matrix, squadron }) => {};
const mockHandlerGameOver = () => {};
export class Controller {
    opponentField;

    player;

    opponent;

    handlerChangePlayerField;

    handlerChangeOpponentField;

    shotQueue;

    handlerGameOver;

    constructor({
        opponentFieldRef,
        playerSquadron,
        playerMatrix,
        handlerChangePlayerField,
        handlerChangeOpponentField,
        handlerGameOver
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
        this.onChangeField();
        this.handlerGameOver = handlerGameOver || mockHandlerGameOver;
    }

    handlerPlayerShot(e) {
        if (this.shotQueue === activeFieldIds.player) {
            const [x, y] = this.transformCoordsInMatrix(e);
            this.makeShot({ x, y });
        }
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
                this.miss({ x, y, activeField });
                break;
            // попадание
            case MatrixCell.deck:
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

        this.onChangeField();

        if (
            Object.entries(activeField.getSquadron()).every(
                ([shipId, shipData]) => shipData.type === shipData.hits,
            )
        ) {
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
