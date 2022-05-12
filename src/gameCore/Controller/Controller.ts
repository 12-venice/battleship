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
        this.handlerChangePlayerField({
            matrix: this.player.getMatrix(),
            squadron: this.player.getSquadron(),
        });
        this.handlerChangeOpponentField({
            matrix: this.opponent.getMatrix(),
            squadron: this.opponent.getSquadron(),
        });
        // this.shotQueue = getRandom(1);
        this.shotQueue = 1;
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
        const v =
            this.shotQueue === 0
                ? this.opponent.matrix[x][y]
                : this.player.matrix[x][y];
        // debugger;
        switch (v) {
            case MatrixCell.empty: // промах
                this.miss({ x, y });
                break;
            case MatrixCell.deck: // попадание
                this.hit({ x, y });
                break;
            case MatrixCell.hit:
            case MatrixCell.miss:
                // Controller.showServiceText('По этим координатам вы уже стреляли!');
                break;
        }
    }

    hit({ x, y }) {
        // debugger;
        if (this.shotQueue === 0) {
            const matrix = this.opponent.getMatrix();
            matrix[x][y] = MatrixCell.hit;
            this.opponent.setMatrix(matrix);

            const squadron = this.opponent.getSquadron();
            Object.entries(squadron).map(([shipName, ship]) => {});

            this.handlerChangeOpponentField({
                matrix: this.opponent.getMatrix(),
                squadron: this.opponent.getSquadron(),
            });
        } else {
            const matrix = this.player.getMatrix();
            matrix[x][y] = MatrixCell.hit;
            this.player.setMatrix(matrix);

            const squadron = this.opponent.getSquadron();
            console.log(
                Object.entries(squadron).find(([shipName, { arrDecks }]) =>
                    arrDecks.includes([x, y]),),
            );

            this.handlerChangePlayerField({
                matrix: this.player.getMatrix(),
                squadron: this.player.getSquadron(),
            });
        }
    }

    miss({ x, y }) {
        // debugger;
        if (this.shotQueue === 0) {
            const matrix = this.opponent.getMatrix();
            matrix[x][y] = MatrixCell.miss;
            this.opponent.setMatrix(matrix);
            this.handlerChangeOpponentField({
                matrix: this.opponent.getMatrix(),
                squadron: this.opponent.getSquadron(),
            });
            this.shotQueue = 1;
        } else {
            const matrix = this.player.getMatrix();
            matrix[x][y] = MatrixCell.miss;
            this.player.setMatrix(matrix);
            this.handlerChangePlayerField({
                matrix: this.player.getMatrix(),
                squadron: this.player.getSquadron(),
            });
            this.shotQueue = 0;
        }
    }

    transformCoordsInMatrix(areaEvent) {
        const areaCoords = getCoordinates(areaEvent.target);
        const cellSize = areaEvent.target.width / 10;
        const x = Math.trunc((areaEvent.pageY - areaCoords.top) / cellSize);
        const y = Math.trunc((areaEvent.pageX - areaCoords.left) / cellSize);
        return [x, y];
    }
}
