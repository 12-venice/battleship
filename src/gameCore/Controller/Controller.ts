import { Field } from 'src/gameCore/Field';
import {
    getCoordinates,
    getRandomLocationShipsAndMatrix,
    getRandom,
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
        // debugger
        this.opponentField = opponentFieldRef;
        this.handlerChangePlayerField =
            handlerChangePlayerField || mockHandlerChangeField;
        this.handlerChangeOpponentField =
            handlerChangeOpponentField || mockHandlerChangeField;

        this.player = new Field({
            matrix: playerMatrix,
            squadron: playerSquadron,
        });
        this.opponent = new Field(getRandomLocationShipsAndMatrix());

        // this.shotQueue = getRandom(1);
        this.shotQueue = 1;
        this.onChangeField();
    }

    handlerPlayerShot(e) {
        if (this.shotQueue === 0) {
            this.makeShot(e);
        }
    }

    handlerOpponentShot(e) {
        if (this.shotQueue === 1) {
            this.makeShot(e);
        }
    }

    makeShot(e) {
        const [x, y] = this.transformCoordsInMatrix(e);
        const activeField = this.shotQueue === 0 ? this.opponent : this.player;
        const v = activeField.matrix[x][y];
        // debugger;
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
        // debugger;
        const matrix = activeField.getMatrix();
        matrix[x][y] = MatrixCell.hit;
        activeField.setMatrix(matrix);

        this.onChangeField();
    }

    miss({ x, y, activeField }) {
        // debugger;
        const matrix = activeField.getMatrix();
        matrix[x][y] = MatrixCell.miss;
        activeField.setMatrix(matrix);

        this.onChangeField();

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
