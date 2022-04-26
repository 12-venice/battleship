import { getCoordinates } from 'src/gameCore/helpers/getCoordinates';
import type { DragImageEvent } from './types';

export class Placement {
    field;

    selectedShipElement: EventTarget | null = null;

    dragObject = {};

    constructor({ field }) {
        this.field = field;
        this.handlerShipDragStart = this.handlerShipDragStart.bind(this);
        this.handlerShipDragEnd = this.handlerShipDragEnd.bind(this);
        this.handlerShipOver = this.handlerShipOver.bind(this);
    }

    handlerShipDragStart(event: DragImageEvent) {
        if (event.target?.dataset?.shipId) {
            this.selectedShipElement = event.target;
            this.dragObject = this.getDragObjectFromEvent(event);
            console.log(this.dragObject);
        }
    }

    handlerShipOver(event: DragImageEvent) {
        if (this.selectedShipElement) {
            const dropX = this.dragObject.pageX - event.pageX;
            const dropY = this.dragObject.pageY - event.pageY;

            this.selectedShipElement.style.left = `${
                this.dragObject.left - dropX
            }px`;
            this.selectedShipElement.style.bottom = `${
                this.dragObject.bottom + dropY
            }px`;
        }
    }

    handlerShipDragEnd(event: DragImageEvent) {
        if (this.selectedShipElement) {
            if (!this.checkShipInFrame(event.target)) {
                this.moveShipToStartPosition();
            } else {
                const shipCoords = getCoordinates(event.target);
                const frameCoords = getCoordinates(this.field.current);
                const shipMenuCoords = getCoordinates(this.dragObject.parent);
                const cellSize = this.field.current.width / 10;
                const x = Math.round(
                    (shipCoords.top - frameCoords.top) / cellSize,
                );
                const y = Math.round(
                    (shipCoords.left - frameCoords.left) / cellSize,
                );
                const left =
                    frameCoords.left + cellSize * y - shipMenuCoords.left;
                const bottom =
                    shipMenuCoords.bottom -
                    (frameCoords.top + cellSize * (x + this.dragObject.deck));

                this.moveShipToPosition({
                    shipElement: event.target,
                    left,
                    bottom,
                });
            }

            this.selectedShipElement = null;
            this.dragObject = {};
        }
    }

    checkShipInFrame(shipElement) {
        const shipCoords = getCoordinates(shipElement);
        const frameCoords = getCoordinates(this.field.current);
        const gap = 14;

        return (
            shipCoords.left >= frameCoords.left - gap &&
            shipCoords.right <= frameCoords.right + gap &&
            shipCoords.top >= frameCoords.top - gap &&
            shipCoords.bottom <= frameCoords.bottom + gap
        );
    }

    moveShipToStartPosition() {
        this.moveShipToPosition({
            shipElement: this.dragObject.el,
            left: this.dragObject.initialLeft,
            bottom: this.dragObject.initialBottom,
        });
    }

    moveShipToPosition({ shipElement, left, bottom }) {
        shipElement.style.left = `${left.toFixed(3)}px`;
        shipElement.style.bottom = `${bottom.toFixed(3)}px`;
    }

    getDragObjectFromEvent(event) {
        const el = event.target;
        return {
            el,
            deck: parseInt(el.dataset.deck, 10),
            // coords: getCoordinates(el),
            parent: el.parentElement,
            // next: el.nextElementSibling,
            // координаты, с которых начат перенос
            pageX: event.pageX,
            pageY: event.pageY,
            // координаты 'left' и 'top' используются при редактировании
            // положения корабля на игровом поле
            left: parseInt(el.style.left, 10),
            bottom: parseInt(el.style.bottom, 10),
            initialLeft: parseInt(el.dataset.left, 10),
            initialBottom: parseInt(el.dataset.bottom, 10),
            // горизонтальное положение корабля
            kx: 0,
            ky: 1,
        };
    }
}
