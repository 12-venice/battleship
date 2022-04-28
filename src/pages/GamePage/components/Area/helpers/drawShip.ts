import { shipsSrcMap, ripShipsSrcMap } from 'src/pages/GamePage/data';

export const drawShip = ({
    ctx,
    x,
    y,
    type,
    cellSize,
    isHorizontal = false,
    isRip = false,
}) => {
    const image: HTMLImageElement = new Image();
    image.src = isRip ? ripShipsSrcMap.get(type) : shipsSrcMap.get(type);
    image.onload = () => {
        if (isHorizontal) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((Math.PI / 180) * 90);
            ctx.drawImage(
                image,
                -2,
                -(cellSize * type - 1),
                cellSize,
                cellSize * type,
            );
            ctx.restore();
        } else {
            ctx.drawImage(image, x - 1, y, cellSize, cellSize * type);
        }
    };
};
