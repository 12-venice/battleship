import {
    getCoordinates,
    removeShip,
    getRandomLocationShipsAndMatrix,
} from 'src/gameCore/helpers';
import { Ship } from 'src/gameCore/Ship';
import { Field } from 'src/gameCore/Field';
import { checkLocationShip } from 'src/gameCore/helpers/checkLocationShip';
import {
    rotateElement,
    getDragObjectFromEvent,
    moveElementToPosition,
    checkElementInFrame,
    calculateElementPositionInFrame,
} from './helpers';
import type { DragImageEvent } from './types';

export class Placement extends Field {
    field;

    selectedShipElement: EventTarget | null = null;

    dragObject = {};

    shipFactory;

    constructor({ field }) {
        super();

        this.field = field;
        this.shipFactory = new Ship();

        this.handlerShipDragStart = this.handlerShipDragStart.bind(this);
        this.handlerShipDragEnd = this.handlerShipDragEnd.bind(this);
        this.handlerShipOver = this.handlerShipOver.bind(this);
        this.rotationShip = this.rotationShip.bind(this);
        this.randomLocationShips = this.randomLocationShips.bind(this);
        this.resetLocationShips = this.resetLocationShips.bind(this);
    }

    /** Обработчик начала перетаскивания */
    handlerShipDragStart(event: DragImageEvent) {
        if (event.target?.dataset?.shipId) {
            this.selectedShipElement = event.target;
            this.dragObject = getDragObjectFromEvent(event);

            const { matrix, squadron } = removeShip({
                matrix: this.getMatrix(),
                squadron: this.getSquadron(),
                name: this.dragObject.shipId,
            });

            this.setMatrix(matrix);
            this.setSquadron(squadron);
        }
    }

    /** Обработчик перетаскивания */
    handlerShipOver(event: DragImageEvent) {
        if (this.selectedShipElement) {
            const dropX = this.dragObject.pageX - event.pageX;
            const dropY = this.dragObject.pageY - event.pageY;

            moveElementToPosition({
                element: this.selectedShipElement,
                left: this.dragObject.left - dropX,
                bottom: this.dragObject.bottom + dropY,
            });
        }
    }

    /** Обработчик окончания перетаскивания */
    handlerShipDragEnd(event: DragImageEvent) {
        // если корабль не был выбран - игнорируем
        if (!this.selectedShipElement) {
            return;
        }

        const isShipInFrame = checkElementInFrame({
            element: event.target,
            frame: this.field.current,
        });

        // если корабль перетащили вне поля - возвращаем его в исходною позицию в меню
        if (!isShipInFrame) {
            this.handlerShipDragToInvalidPosition({
                shipElement: event.target,
            });
            return;
        }

        const shipCoords = getCoordinates(event.target);
        const frameCoords = getCoordinates(this.field.current);
        const cellSize = this.field.current.width / 10;
        const x = Math.round((shipCoords.top - frameCoords.top) / cellSize);
        const y = Math.round((shipCoords.left - frameCoords.left) / cellSize);
        const isValidLocationShip = checkLocationShip({
            x,
            y,
            kx: this.dragObject.kx,
            ky: this.dragObject.ky,
            decks: this.dragObject.decks,
            matrix: this.getMatrix(),
        });

        // если корабль невозможно установить на выбранную позицию -
        // возвращаем его в исходною позицию в меню
        if (!isValidLocationShip) {
            this.handlerShipDragToInvalidPosition({
                shipElement: event.target,
            });
            return;
        }

        const { left, bottom } = calculateElementPositionInFrame({
            element: event.target,
            frameElement: this.field.current,
            x,
            y,
            kx: this.dragObject.kx,
            deck: this.dragObject.decks,
        });

        // корректируем позицию корабля внутри ячеек
        moveElementToPosition({
            element: event.target,
            left,
            bottom,
        });

        this.createShipAfterMoving({
            x,
            y,
            kx: this.dragObject.kx,
            ky: this.dragObject.ky,
            decks: this.dragObject.decks,
            shipId: this.dragObject.shipId,
        });

        this.resetDragData();
    }

    handlerShipDragToInvalidPosition({ shipElement }) {
        rotateElement({ element: shipElement, deg: 0 });

        this.moveShipToStartPosition();
        this.resetDragData();
    }

    resetDragData() {
        this.selectedShipElement = null;
        this.dragObject = {};
    }

    moveShipToStartPosition() {
        moveElementToPosition({
            element: this.dragObject.el,
            left: this.dragObject.initialLeft,
            bottom: this.dragObject.initialBottom,
        });
    }

    createShipAfterMoving({ x, y, kx, ky, decks, shipId }) {
        const ship = this.shipFactory.createShip({ x, y, kx, ky, decks });

        this.setSquadron({
            ...this.getSquadron(),
            [shipId]: ship,
        });
    }

    rotationShip(event) {
        event.preventDefault();

        const shipId = event.target?.dataset?.shipId;
        const ship = this.getSquadron()[shipId];

        if (!shipId || !ship || ship.arrDecks.length === 1) {
            return;
        }

        let obj = {
            kx: ship.kx === 0 ? 1 : 0,
            ky: ship.ky === 0 ? 1 : 0,
            x: ship.x,
            y: ship.y,
        };
        const deckCount = ship.arrDecks.length;

        removeShip({
            matrix: this.getMatrix(),
            squadron: this.getSquadron(),
            name: shipId,
        });

        const isValidLocationShip = checkLocationShip({
            ...obj,
            decks: deckCount,
            matrix: this.getMatrix(),
        });

        if (!isValidLocationShip) {
            obj = { ...obj, kx: obj.ky, ky: obj.kx };
        }

        this.createShipAfterMoving({
            x: obj.x,
            y: obj.y,
            kx: obj.kx,
            ky: obj.ky,
            decks: deckCount,
            shipId,
        });

        rotateElement({ element: event.target, deg: obj.ky ? 90 : 0 });

        const { left, bottom } = calculateElementPositionInFrame({
            element: event.target,
            frameElement: this.field.current,
            x: obj.x,
            y: obj.y,
            kx: obj.kx,
            deck: deckCount,
        });

        moveElementToPosition({
            element: event.target,
            left,
            bottom,
        });
    }

    randomLocationShips() {
        const { squadron, matrix } = getRandomLocationShipsAndMatrix();

        this.setMatrix(matrix);
        this.setSquadron(squadron);

        Object.entries(squadron).forEach(([name, { x, y, kx, arrDecks }]) => {
            const shipElement = document.getElementById(name);
            const { left, bottom } = calculateElementPositionInFrame({
                element: shipElement,
                frameElement: this.field.current,
                x,
                y,
                kx,
                deck: arrDecks.length,
            });

            rotateElement({ element: shipElement, deg: kx ? 0 : 90 });

            moveElementToPosition({ element: shipElement, left, bottom });
        });
    }

    resetLocationShips() {
        Object.entries(this.getSquadron()).forEach(([name]) => {
            const shipElement = document.getElementById(name);
            const left = parseInt(shipElement.dataset.left, 10);
            const bottom = parseInt(shipElement.dataset.bottom, 10);

            rotateElement({ element: shipElement, deg: 0 });

            moveElementToPosition({ element: shipElement, left, bottom });
        });

        this.cleanField();
    }
}
