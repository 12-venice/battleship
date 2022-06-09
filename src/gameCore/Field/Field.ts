import { getEmptyMatrix } from 'src/gameCore/helpers';

export class Field {
    /** создаём пустой объект, куда будем заносить данные по каждому созданному кораблю */
    private squadron = {};

    /** двумерный массив, в который заносятся координаты кораблей, а в ходе
     * морского боя, координаты попаданий, промахов и заведомо пустых клеток */
    private matrix;

    constructor({ matrix, squadron }) {
        this.matrix = matrix || getEmptyMatrix();
        this.squadron = squadron || {};
    }

    setMatrix(matrix) {
        if (!matrix || !Array.isArray(matrix)) return;
        console.log('[debug] set matrix');
        this.matrix = matrix;
    }

    getMatrix() {
        return [...this.matrix];
    }

    setSquadron(squadron) {
        if (!squadron) return;
        console.log('[debug] set squadron', squadron);
        this.squadron = squadron;
    }

    getSquadron() {
        return { ...this.squadron };
    }

    cleanField() {
        this.setMatrix(getEmptyMatrix());
        this.setSquadron({});
    }
}
