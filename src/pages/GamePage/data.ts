// @ts-nocheck
import ship1Img from 'images/ships/1-ship.png';
import ship2Img from 'images/ships/2-ship.png';
import ship3Img from 'images/ships/3-ship.png';
import ship4Img from 'images/ships/4-ship.png';

export const shipsSrcMap = new Map([
    [1, ship1Img],
    [2, ship2Img],
    [3, ship3Img],
    [4, ship4Img],
]);

export const AREA_WIDTH =
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
export const AREA_CELL_WIDTH = AREA_WIDTH / 10;
export const AREA_CELL_GAP = 2;
