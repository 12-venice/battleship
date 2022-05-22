import ship1Img from 'images/ships/1-ship.png';
import ship2Img from 'images/ships/2-ship.png';
import ship3Img from 'images/ships/3-ship.png';
import ship4Img from 'images/ships/4-ship.png';
import ripShip1Img from 'images/ships/1-ship-rip.png';
import ripShip2Img from 'images/ships/2-ship-rip.png';
import ripShip3Img from 'images/ships/3-ship-rip.png';
import ripShip4Img from 'images/ships/4-ship-rip.png';

export const shipsSrcMap = new Map([
    [1, ship1Img],
    [2, ship2Img],
    [3, ship3Img],
    [4, ship4Img],
]);

export const ripShipsSrcMap = new Map([
    [1, ripShip1Img],
    [2, ripShip2Img],
    [3, ripShip3Img],
    [4, ripShip4Img],
]);

export const AREA_WIDTH = window.innerWidth / 2;
export const AREA_CELL_WIDTH = AREA_WIDTH / 10;
export const AREA_CELL_GAP = 2;
