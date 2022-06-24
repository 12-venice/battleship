export const drawShip = ({
    ctx,
    x,
    shipsAlive,
    ripShips,
    y,
    type,
    cellSize,
    isHorizontal = false,
    isRip = false,
}) => {
    const image = isRip ? shipsAlive.get(type) : ripShips.get(type);
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
