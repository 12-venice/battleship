import { shipsSrcMap } from 'src/pages/GamePage/data';

export const drawShip = ({
    ctx,
    x,
    y,
    type,
    cellSize,
    isHorizontal = false,
}) => {
    const image = new Image(cellSize, cellSize * type);
    image.src = shipsSrcMap.get(type);
    image.onload = () => {
        if (isHorizontal) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((Math.PI / 180) * 90);
            ctx.drawImage(image, -5, -(cellSize * type - 3));
            ctx.restore();
        } else {
            ctx.drawImage(image, x, y);
        }
    };
};
