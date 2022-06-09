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
        console.log('[setHit]')
        this.opponentMatrix[x][y] = MatrixCell.hit;
    }

    setMissCoords({ x, y }) {
        console.log('[setMiss]')
        this.opponentMatrix[x][y] = MatrixCell.miss;
    }

    getCoordsForShot() {
        const x = getRandom(9);
        const y = getRandom(9);
        console.log(
            '[debug]',
            x,
            y,
            this.opponentMatrix,
            this.opponentMatrix[x][y],
        );

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
        }, 500);
    }
}
