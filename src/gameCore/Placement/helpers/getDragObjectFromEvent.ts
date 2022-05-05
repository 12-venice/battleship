export const getDragObjectFromEvent = (event) => {
    const element = event.target;
    return {
        el: element,
        shipId: element.dataset.shipId,
        decks: parseInt(element.dataset.deck, 10),
        // coords: getCoordinates(el),
        parent: element.parentElement,
        // next: el.nextElementSibling,
        // координаты, с которых начат перенос
        pageX: event.pageX,
        pageY: event.pageY,
        // координаты 'left' и 'top' используются при редактировании
        // положения корабля на игровом поле
        left: parseInt(element.style.left, 10),
        bottom: parseInt(element.style.bottom, 10),
        initialLeft: parseInt(element.dataset.left, 10),
        initialBottom: parseInt(element.dataset.bottom, 10),
        // горизонтальное положение корабля
        kx: element.style.transform === 'rotate(0deg)' ? 1 : 0,
        ky: element.style.transform === 'rotate(90deg)' ? 1 : 0,
    };
};
