import { createStore } from 'redux';
import reducer from './reducers';

export function configureStore(middleware?: any, initialState = {}) {
    const store = createStore(reducer, initialState, middleware);
    return store;
}
