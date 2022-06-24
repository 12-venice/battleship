import { Field } from 'src/gameCore/Field';
import { getEmptyMatrix, getRandom } from 'src/gameCore/helpers';
import { MatrixCell } from 'src/gameCore/types';

export class BotField extends Field {
    opponentMatrix;

    lastHit: any;

    target: any;

    constructor({ matrix, squadron }) {
        super({ matrix, squadron });
        this.lastHit = [];
        this.target = [];
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

    checkCoords([x, y]) {
        if (
            this.opponentMatrix[x][y] === MatrixCell.hit ||
            this.opponentMatrix[x][y] === MatrixCell.miss
        ) {
            return false;
        }
        return { x, y };
    }

    nextShot(callback, playerFiel, prevShot) {
        this.lastHit.push(prevShot);
        this.target = this.searchShip(prevShot, playerFiel).filter(
            (c) => c[0] !== prevShot[0] && c[1] !== prevShot[1],
        );
        const targetCoords = this.target.pop();
        // const [x, y] = this.getCoordsForShot();
        setTimeout(() => {
            callback({ x: targetCoords[0], y: targetCoords[1] });
        }, 1000);
    }

    searchShip(coords, field) {
        if (!field) return;
        const result = Object.entries(field.squadron).filter(
            ([shipId, shipData]) => {
                const r = shipData.arrDecks.filter(
                    (c) => c[0] === coords[0] && c[1] === coords[1],
                );
                if (r.length > 0) {
                    return true;
                }
                return false;
            },
        );
        return result[0][1].arrDecks;
        // (c) => c[0] === coords[0] && c[1] === coords[1],
        console.log(result[0][1].arrDecks); // [[], [], [], []]
    }

    // pickDirection(shot) {}
}
