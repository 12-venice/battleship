import { getCoordinates } from 'src/gameCore/helpers';

export const checkElementInFrame = ({ element, frame }) => {
    const elementCoords = getCoordinates(element);
    const frameCoords = getCoordinates(frame);
    const accuracy = 14;
    return (
        elementCoords.left >= frameCoords.left - accuracy &&
        elementCoords.right <= frameCoords.right + accuracy &&
        elementCoords.top >= frameCoords.top - accuracy &&
        elementCoords.bottom <= frameCoords.bottom + accuracy
    );
};
