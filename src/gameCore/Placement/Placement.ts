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
                this.moveShipToStartPosition(event.target);
            } else {
                const {x, y, left, bottom} = this.getCoordsCloneInMatrix(event.target);

                this.selectedShipElement.style.left = `${left}px`;
                this.selectedShipElement.style.bottom = `${bottom}px`;
            }

            this.selectedShipElement = null;
            this.dragObject = {};
        }
    }

    getCoordsCloneInMatrix(shipElement) {
        const shipCoords = getCoordinates(shipElement);
        const frameCoords = getCoordinates(this.field.current);
        const fieldSize = this.field.current.width;
        const cellSize = fieldSize / 10;

        // вычисляем разницу координат соотвествующих сторон
        // клона и игрового поля
        const computedLeft = shipCoords.left - frameCoords.left;
        const computedRight = shipCoords.right - frameCoords.left;
        const computedTop = shipCoords.top - frameCoords.top;
        const computedBottom = shipCoords.bottom - frameCoords.top;
        debugger

        // создаём объект, куда поместим итоговые значения
        const obj = {};

        // в результате выполнения условия, убираем неточности позиционирования клона
        const ft =
            computedTop < 0
                ? 0
                : computedBottom > fieldSize
                    ? fieldSize - cellSize
                    : computedTop;
        const fl =
            computedLeft < 0
                ? 0
                : computedRight > fieldSize
                ? fieldSize - cellSize * this.dragObject.el.dataset.shipId
                : computedLeft;

        obj.top = Math.round(ft / cellSize) * cellSize;
        obj.left = Math.round(fl / cellSize) * cellSize;
        // переводим значение в координатах матрицы
        obj.x = obj.top / cellSize;
        obj.y = obj.left / cellSize;

        return obj;
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

    moveShipToStartPosition(shipElement) {
        this.selectedShipElement.style.left = `${shipElement.dataset.left}px`;
        this.selectedShipElement.style.bottom = `${shipElement.dataset.bottom}px`;
    }

    getDragObjectFromEvent(event) {
        const el = event.target;
        return {
            el,
            parent: el.parentElement,
            next: el.nextElementSibling,
            // координаты, с которых начат перенос
            pageX: event.pageX,
            pageY: event.pageY,
            // координаты 'left' и 'top' используются при редактировании
            // положения корабля на игровом поле
            left: parseInt(el.style.left, 10),
            bottom: parseInt(el.style.bottom, 10),
            // горизонтальное положение корабля
            kx: 0,
            ky: 1,
        };
    }
}
