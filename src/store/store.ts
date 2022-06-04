import { createStore } from 'redux';
import reducer from './reducers';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export function configureStore(middleware?: any, initialState = {}) {
    const store = createStore(reducer, initialState, middleware);
    return store;
}

export const store = configureStore(applyMiddleware(thunk));