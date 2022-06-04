import { getCoordinates } from 'src/gameCore/helpers';

export const calculateElementPositionInFrame = ({
    element,
    frameElement,
    x,
    y,
    kx,
    deck,
}) => {
    const frameCoords = getCoordinates(frameElement);
    const shipMenuCoords = getCoordinates(element.parentElement);
    const cellSize = frameElement.width / 10;

    const left = kx
        ? frameCoords.left + cellSize * y - shipMenuCoords.left
        : frameCoords.left + cellSize * (y + deck) - shipMenuCoords.left;
    const bottom = kx
        ? shipMenuCoords.bottom - (frameCoords.top + cellSize * (x + deck))
        : shipMenuCoords.bottom - (frameCoords.top + cellSize * (x + deck));

    return { left, bottom };
};
