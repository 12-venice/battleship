/* eslint-disable indent */
const actions = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
};

export function countReducer(
    action: { type: keyof action },
    state = 0,
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
