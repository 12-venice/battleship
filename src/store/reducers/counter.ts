/* eslint-disable default-param-last */
/* eslint-disable indent */
const actions = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
};

export function countReducer(
    state = 0,
    action: { type: 'INCREMENT' | 'DECREMENT' },
): number {
    const { type } = action;
    switch (type) {
        case actions.INCREMENT:
            return state + 1;
        case actions.DECREMENT:
            return state - 1;
        default:
            return state;
    }
}

export function incCount() {
    return { type: actions.INCREMENT };
}

export function decCount() {
    return { type: actions.DECREMENT };
}
