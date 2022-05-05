export const moveElementToPosition = ({ element, left, bottom }) => {
    // eslint-disable-next-line no-param-reassign
    element.style.left = `${left.toFixed(3)}px`;
    // eslint-disable-next-line no-param-reassign
    element.style.bottom = `${bottom.toFixed(3)}px`;
};
