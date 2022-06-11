import { Field } from 'src/gameCore/Field';
import { getEmptyMatrix, getRandom } from 'src/gameCore/helpers';
import { MatrixCell } from 'src/gameCore/types';

export class BotField extends Field {
    opponentMatrix;

    constructor({ matrix, squadron }) {
        super({ matrix, squadron });

        this.opponentMatrix = getEmptyMatrix();
    }

    setHitCoords({ x, y }) {
        this.opponentMatrix[x][y] = MatrixCell.hit;
    }

    setMissCoords({ x, y }) {
        this.opponentMatrix[x][y] = MatrixCell.miss;
    }

    getCoordsForShot() {
        const x = getRandom(9);
        const y = getRandom(9);

        if (
            this.opponentMatrix[x][y] === MatrixCell.hit ||
            this.opponentMatrix[x][y] === MatrixCell.miss
        ) {
            return this.getCoordsForShot();
        }

        return [x, y];
    }

    nextShot(callback) {
        const [x, y] = this.getCoordsForShot();
        setTimeout(() => {
            callback({ x, y });
        }, 1000);
    }
}
