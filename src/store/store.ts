import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

export function configureStore(middleware?: any, initialState = {}) {
    const store = createStore(reducer, initialState, middleware);
    return store;
}

export const store = configureStore(applyMiddleware(thunk));
