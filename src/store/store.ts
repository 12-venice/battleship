import { createStore } from 'redux';

export function configureStore(middleware?: any, initialState = {}) {
    const store = createStore(reducer, initialState, middleware);
    return store;
}
