import { getCoordinates } from 'src/gameCore/helpers/getCoordinates';
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
        this.rotationShip = this.rotationShip.bind(this);
        this.randomLocationShips = this.randomLocationShips.bind(this);
        this.resetLocationShips = this.resetLocationShips.bind(this);
        this.calculateShipPositionInFrame =
            this.calculateShipPositionInFrame.bind(this);
    }

    handlerShipDragStart(event: DragImageEvent) {
        if (event.target?.dataset?.shipId) {
            this.selectedShipElement = event.target;
            this.dragObject = this.getDragObjectFromEvent(event);
            this.player.removeShipFromSquadron(this.dragObject.shipId);
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
                this.handlerShipDragToInvalidPosition({
                    shipElement: event.target,
                });
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

            if (!isValidLocationShip) {
                this.handlerShipDragToInvalidPosition({
                    shipElement: event.target,
                });
                return;
            }

            const { left, bottom } = this.calculateShipPositionInFrame({
                shipElement: event.target,
                x,
                y,
                kx: this.dragObject.kx,
                deck: this.dragObject.deck,
            });

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

    handlerShipDragToInvalidPosition({ shipElement }) {
        shipElement.style.transform = 'rotate(0deg)';

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
            kx: this.player.squadron[el.dataset.shipId]?.kx === 0 ? 0 : 1,
            ky: this.player.squadron[el.dataset.shipId]?.ky === 1 ? 1 : 0,
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

    rotationShip(event) {
        event.preventDefault();

        const shipId = event.target?.dataset?.shipId;

        if (
            !shipId ||
            !this.player.squadron[shipId] ||
            this.player.squadron[shipId].arrDecks.length === 1
        ) {
            return;
        }

        let obj = {
            kx: this.player.squadron[shipId].kx === 0 ? 1 : 0,
            ky: this.player.squadron[shipId].ky === 0 ? 1 : 0,
            x: this.player.squadron[shipId].x,
            y: this.player.squadron[shipId].y,
        };
        const deckCount = this.player.squadron[shipId].arrDecks.length;

        this.player.removeShipFromSquadron(shipId);

        const isValidLocationShip = this.player.checkLocationShip(
            obj,
            deckCount,
        );

        if (!isValidLocationShip) {
            obj = { ...obj, kx: obj.ky, ky: obj.kx };
        }

        this.createShipAfterMoving({
            x: obj.x,
            y: obj.y,
            kx: obj.kx,
            ky: obj.ky,
            decks: deckCount,
            shipname: shipId,
            player: this.player,
        });

        event.target.style.transform = obj.ky
            ? 'rotate(90deg)'
            : 'rotate(0deg)';

        const { left, bottom } = this.calculateShipPositionInFrame({
            shipElement: event.target,
            x: obj.x,
            y: obj.y,
            kx: obj.kx,
            deck: deckCount,
        });

        this.moveShipToPosition({
            shipElement: event.target,
            left,
            bottom,
        });
    }

    calculateShipPositionInFrame({ shipElement, x, y, kx, deck }) {
        const frameCoords = getCoordinates(this.field.current);
        const shipMenuCoords = getCoordinates(shipElement.parentElement);
        const cellSize = this.field.current.width / 10;

        const left = kx
            ? frameCoords.left + cellSize * y - shipMenuCoords.left
            : frameCoords.left + cellSize * (y + deck) - shipMenuCoords.left;
        const bottom = kx
            ? shipMenuCoords.bottom - (frameCoords.top + cellSize * (x + deck))
            : shipMenuCoords.bottom - (frameCoords.top + cellSize * (x + deck));

        return { left, bottom };
    }

    randomLocationShips() {
        this.player.randomLocationShips();

        Object.entries(this.player.getSquadron()).forEach(
            ([name, { x, y, kx, arrDecks }]) => {
                const shipElement = document.getElementById(name);
                const { left, bottom } = this.calculateShipPositionInFrame({
                    shipElement,
                    x,
                    y,
                    kx,
                    deck: arrDecks.length,
                });

                shipElement.style.transform = kx
                    ? 'rotate(0deg)'
                    : 'rotate(90deg)';

                this.moveShipToPosition({ shipElement, left, bottom });
            },
        );
    }

    resetLocationShips() {
        Object.entries(this.player.getSquadron()).forEach(([name]) => {
            const shipElement = document.getElementById(name);
            const left = parseInt(shipElement.dataset.left, 10);
            const bottom = parseInt(shipElement.dataset.bottom, 10);

            shipElement.style.transform = 'rotate(0deg)';

            this.moveShipToPosition({ shipElement, left, bottom });
        });

        this.player.cleanField();
    }
}
