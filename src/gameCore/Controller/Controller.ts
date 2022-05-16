import { Field } from 'src/gameCore/Field';
import { BotField } from 'src/gameCore/BotField';
import {
    getCoordinates,
    getRandomLocationShipsAndMatrix,
} from 'src/gameCore/helpers';
import { MatrixCell } from 'src/gameCore/types';

const mockHandlerChangeField = ({ matrix, squadron }) => {};

export class Controller {
    opponentField;

    player;

    opponent;

    handlerChangePlayerField;

    handlerChangeOpponentField;

    shotQueue;

    constructor({
        opponentFieldRef,
        playerSquadron,
        playerMatrix,
        handlerChangePlayerField,
        handlerChangeOpponentField,
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

        this.shotQueue = 0;
        this.onChangeField();
    }

    handlerPlayerShot(e) {
        if (this.shotQueue === 0) {
            const [x, y] = this.transformCoordsInMatrix(e);
            this.makeShot({ x, y });
        }
    }

    makeShot({ x, y }) {
        const activeField = this.shotQueue === 0 ? this.opponent : this.player;
        const v = activeField.matrix[x][y];
        switch (v) {
            case MatrixCell.empty: // промах
                this.miss({ x, y, activeField });
                break;
            case MatrixCell.deck: // попадание
                this.hit({ x, y, activeField });
                break;
            case MatrixCell.hit:
            case MatrixCell.miss:
                // Controller.showServiceText('По этим координатам вы уже стреляли!');
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

        if (this.shotQueue === 1) {
            this.opponent.setHitCoords({ x, y });
            this.opponent.nextShot(this.makeShot.bind(this));
        }
    }

    miss({ x, y, activeField }) {
        const matrix = activeField.getMatrix();
        matrix[x][y] = MatrixCell.miss;
        activeField.setMatrix(matrix);

        this.onChangeField();

        if (this.shotQueue === 0) {
            this.opponent.nextShot(this.makeShot.bind(this));
        }

        this.shotQueue = this.shotQueue === 0 ? 1 : 0;
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
