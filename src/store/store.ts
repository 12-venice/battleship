import { createStore } from 'redux';

export function configureStore(initialState = {}) {
    const store = createStore({}, initialState);
    return store;
}
