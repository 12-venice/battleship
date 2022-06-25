/* eslint-disable class-methods-use-this */
import { Field } from 'src/gameCore/Field';
import { getEmptyMatrix, getRandom } from 'src/gameCore/helpers';
import { MatrixCell } from 'src/gameCore/types';

export class BotField extends Field {
    opponentMatrix;

    botTarget: any;

    fieldMap: any;

    constructor({ matrix, squadron }) {
        super({ matrix, squadron });
        this.botTarget = [];
        this.opponentMatrix = getEmptyMatrix();
        this.fieldMap = getEmptyMatrix();
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
            this.opponentMatrix[x][y] === MatrixCell.miss ||
            this.fieldMap[x][y] === 1
        ) {
            return this.getCoordsForShot();
        }

        return [x, y];
    }

    generateRoundShots() {
        const hitDecks = this.botTarget;
        const resultVariant = [];
        hitDecks.forEach((hitDeck) => {
            const nextShotVariant = [
                [hitDeck[0], hitDeck[1] + 1],
                [hitDeck[0], hitDeck[1] - 1],
                [hitDeck[0] + 1, hitDeck[1]],
                [hitDeck[0] - 1, hitDeck[1]],
                [hitDeck[0] - 1, hitDeck[1] + 1],
                [hitDeck[0] + 1, hitDeck[1] - 1],
                [hitDeck[0] + 1, hitDeck[1] + 1],
                [hitDeck[0] - 1, hitDeck[1] - 1],
            ];
            nextShotVariant.forEach((coords) => {
                resultVariant.push(coords);
            });
        });
        const result = resultVariant.filter((coords) =>
            this.checkCoordsInFieldMap(coords),);
        result.forEach((coords) => {
            this.fieldMap[coords[0]][coords[1]] = 1;
        });
    }

    updateFieldMap(coords, status, isRip = false) {
        if (status === MatrixCell.miss) {
            this.fieldMap[coords[0]][coords[1]] = 1;
        } else if (status === MatrixCell.hit && isRip) {
            this.fieldMap[coords[0]][coords[1]] = 1;
            this.botTarget.push(coords);
            this.generateRoundShots();
            this.botTarget = [];
        } else {
            this.fieldMap[coords[0]][coords[1]] = 1;
            this.botTarget.push(coords);
        }
    }

    checkCoordsInFieldMap(coords: number[]) {
        if (coords[0] < 0 || coords[1] < 0 || coords[0] > 9 || coords[1] > 9) {
            return false;
        }
        if (this.fieldMap[coords[0]][coords[1]] === 1) {
            return false;
        }
        return true;
    }

    selectVariant(arr) {
        const untouched = arr.filter((coords) =>
            this.checkCoordsInFieldMap(coords),);
        const index = Math.floor(Math.random() * untouched.length);
        return untouched[index];
    }

    searchDirection(): number[] | undefined {
        const hitDeck = this.botTarget[0];
        const nextShotVariant = [
            [hitDeck[0], hitDeck[1] + 1],
            [hitDeck[0], hitDeck[1] - 1],
            [hitDeck[0] + 1, hitDeck[1]],
            [hitDeck[0] - 1, hitDeck[1]],
        ];
        return this.selectVariant(nextShotVariant);
    }

    findMinMax(arr, type) {
        const min = arr.reduce((previousValue, currentValue) => {
            if (previousValue[type] < currentValue[type]) {
                return previousValue;
            }
            return currentValue;
        }, arr[0]);
        const max = arr.reduce((previousValue, currentValue) => {
            if (previousValue[type] > currentValue[type]) {
                return previousValue;
            }
            return currentValue;
        }, arr[0]);
        return [min, max];
    }

    checkDirection(): number[] | undefined {
        const hitDecks = this.botTarget;
        if (hitDecks[0][1] === hitDecks[1][1]) {
            const [min, max] = this.findMinMax(hitDecks, 0);
            const nextShotVariant = [
                [min[0] - 1, min[1]],
                [max[0] + 1, max[1]],
            ];
            return this.selectVariant(nextShotVariant);
        }
        const [min, max] = this.findMinMax(hitDecks, 1);
        const nextShotVariant = [
            [min[0], min[1] - 1],
            [max[0], max[1] + 1],
        ];
        return this.selectVariant(nextShotVariant);
    }

    nextShot(callback) {
        const l = this.botTarget.length;
        if (l === 0) {
            const [x, y] = this.getCoordsForShot();
            setTimeout(() => {
                callback({ x, y });
            }, 1000);
        } else if (l === 1) {
            const [x, y] = this.searchDirection() ?? this.getCoordsForShot();
            setTimeout(() => {
                callback({ x, y });
            }, 1000);
        } else {
            const [x, y] = this.checkDirection() ?? this.getCoordsForShot();
            setTimeout(() => {
                callback({ x, y });
            }, 1000);
        }
    }
}
