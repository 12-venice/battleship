import { MatrixCell } from 'src/gameCore/types';
import hitFire from 'images/game/hitFire.png';
import redX from 'images/game/redX.png';
import ripShip01 from 'images/ships/ripShip01.png';
import ship1Img from 'images/ships/1-ship.png';
import ship2Img from 'images/ships/2-ship.png';
import ship3Img from 'images/ships/3-ship.png';
import ship4Img from 'images/ships/4-ship.png';
import ripShip2Img from 'images/ships/2-ship-rip-v2.png';
import ripShip3Img from 'images/ships/3-ship-rip-v2.png';
import ripShip4Img from 'images/ships/4-ship-rip-v2.png';
import { drawCell } from './drawCell';
import { drawMiss } from './drawMiss';
import { drawHit } from './drawHit';
import { drawShip } from './drawShip';
import type { Props, CanvasCtx } from '../types';

export interface DrawMatrix extends Props {
    /** Контекст канваса */
    renderCtx: CanvasCtx;
}

export const drawMatrix = ({
    renderCtx,
    areaWidth,
    fillColor,
    matrix,
    ships,
    fireType,
}: DrawMatrix) => {
    const loadImage = (img: string) =>
        new Promise((resolve) => {
            const newImage = new Image(34, 33);
            newImage.src = img;
            newImage.onload = () => resolve(newImage);
        });

    const drow = async (imgSrcArr: any) => {
        const radius = 8;
        const padding = 2;
        const areaSize = 10;
        const cellSize = areaWidth / areaSize;
        await Promise.all(imgSrcArr.map((item) => loadImage(item))).then(
            (r) => {
                const ripShips = new Map([
                    [1, r[1]],
                    [2, r[2]],
                    [3, r[3]],
                    [4, r[4]],
                ]);
                const shipsAlive = new Map([
                    [1, r[5]],
                    [2, r[6]],
                    [3, r[7]],
                    [4, r[8]],
                ]);
                const fire = fireType ? r[0] : r[9];
                const hitCoordinates: [number, number][] = [];

                const buffer = document.createElement('canvas');
                buffer.width = areaWidth;
                buffer.height = areaWidth;
                const ctx: CanvasRenderingContext2D = buffer.getContext('2d');

                if (matrix) {
                    matrix.forEach((arrRow, x) => {
                        arrRow.forEach((cellValue, y) => {
                            // отрисовка ячейки
                            if ([MatrixCell.empty].includes(cellValue)) {
                                drawCell({
                                    ctx,
                                    x: y * cellSize,
                                    y: x * cellSize,
                                    size: cellSize - padding,
                                    radius,
                                    fillColor,
                                });
                            }

                            // отрисовка промаха
                            if (MatrixCell.miss === cellValue) {
                                drawMiss({
                                    ctx,
                                    x: y * cellSize,
                                    y: x * cellSize,
                                    size: cellSize - padding,
                                });
                            }

                            // собираем попадания в массив для отрисовки над кораблями
                            if (MatrixCell.hit === cellValue) {
                                hitCoordinates.push([y, x]);
                            }
                        });
                    });
                }
                // отрисовка кораблей
                if (ships?.length) {
                    ships.forEach(
                        ({ x, y, deckCount, isHorizontal, isRip }) => {
                            drawShip({
                                ctx,
                                shipsAlive,
                                ripShips,
                                x: y * cellSize,
                                y: x * cellSize,
                                type: deckCount,
                                isHorizontal,
                                isRip,
                                cellSize,
                            });
                        },
                    );
                }
                // отрисовка попаданий
                if (hitCoordinates.length) {
                    hitCoordinates.forEach(([x, y]) => {
                        drawHit({
                            ctx,
                            fire,
                            x: x * cellSize,
                            y: y * cellSize,
                            cellSize,
                        });
                    });
                }
                renderCtx.clearRect(0, 0, areaWidth, areaWidth);
                renderCtx.drawImage(buffer, 0, 0);
            },
        );
    };

    drow([
        hitFire,
        ship1Img,
        ship2Img,
        ship3Img,
        ship4Img,
        ripShip01,
        ripShip2Img,
        ripShip3Img,
        ripShip4Img,
        redX,
    ]);
};
