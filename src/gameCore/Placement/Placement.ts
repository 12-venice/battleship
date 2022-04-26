import { getCoordinates } from 'src/gameCore/helpers/getCoordinates';
import { checkLocationShip } from 'src/gameCore/helpers/checkLocationShip';
import { Ship } from 'src/gameCore/Ship';
import type { DragImageEvent } from './types';

export class Placement {
    field;

    player;

    selectedShipElement: EventTarget | null = null;

    dragObject = {};

    constructor({ field, self }) {
        this.field = field;
        this.player = self;
        this.handlerShipDragStart = this.handlerShipDragStart.bind(this);
        this.handlerShipDragEnd = this.handlerShipDragEnd.bind(this);
        this.handlerShipOver = this.handlerShipOver.bind(this);
    }

    handlerShipDragStart(event: DragImageEvent) {
        if (event.target?.dataset?.shipId) {
            this.selectedShipElement = event.target;
            this.dragObject = this.getDragObjectFromEvent(event);
            this.player.removeShipFromSquadron(this.dragObject.shipId);
            console.log(this.dragObject);
            console.log(this.player.getMatrix());
            console.log(this.player.getSquadron());
        }
    }

    handlerShipOver(event: DragImageEvent) {
        if (this.selectedShipElement) {
            const dropX = this.dragObject.pageX - event.pageX;
            const dropY = this.dragObject.pageY - event.pageY;

            this.moveShipToPosition({
                shipElement: this.selectedShipElement,
                left: this.dragObject.left - dropX,
                bottom: this.dragObject.bottom + dropY,
            });
        }
    }

    handlerShipDragEnd(event: DragImageEvent) {
        if (this.selectedShipElement) {
            // todo проверить на валидность расположения
            const shipCoords = getCoordinates(event.target);
            const frameCoords = getCoordinates(this.field.current);
            const gap = 14;
            const isShipInFrame =
                shipCoords.left >= frameCoords.left - gap &&
                shipCoords.right <= frameCoords.right + gap &&
                shipCoords.top >= frameCoords.top - gap &&
                shipCoords.bottom <= frameCoords.bottom + gap;

            if (!isShipInFrame) {
                this.handlerShipDragToInvalidPosition();
                return;
            }

            const cellSize = this.field.current.width / 10;
            const x = Math.round((shipCoords.top - frameCoords.top) / cellSize);
            const y = Math.round(
                (shipCoords.left - frameCoords.left) / cellSize,
            );
            const isValidLocationShip = this.player.checkLocationShip(
                {
                    x,
                    y,
                    kx: this.dragObject.kx,
                    ky: this.dragObject.ky,
                },
                this.dragObject.deck,
            );

            console.log({ isValidLocationShip });

            if (!isValidLocationShip) {
                this.handlerShipDragToInvalidPosition();
                return;
            }

            const shipMenuCoords = getCoordinates(this.dragObject.parent);
            const left = frameCoords.left + cellSize * y - shipMenuCoords.left;
            const bottom =
                shipMenuCoords.bottom -
                (frameCoords.top + cellSize * (x + this.dragObject.deck));

            this.moveShipToPosition({
                shipElement: event.target,
                left,
                bottom,
            });

            this.createShipAfterMoving({
                x,
                y,
                kx: this.dragObject.kx,
                ky: this.dragObject.ky,
                decks: this.dragObject.deck,
                shipname: this.dragObject.shipId,
                player: this.player,
            });

            this.resetShipData();
        }
    }

    handlerShipDragToInvalidPosition() {
        this.moveShipToStartPosition();
        this.resetShipData();
    }

    resetShipData() {
        this.selectedShipElement = null;
        this.dragObject = {};
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
            shipId: el.dataset.shipId,
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
            kx: 1,
            ky: 0,
        };
    }

    createShipAfterMoving({ x, y, kx, ky, decks, shipname, player }) {
        const ship = new Ship(player, {
            x,
            y,
            kx,
            ky,
            decks,
            shipname,
        });
        ship.createShip();
    }
}
