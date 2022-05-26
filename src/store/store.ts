import { combineReducers, createStore } from 'redux';

function configureStore(reducers = {}, initialState = {}, options = {}) {
    const store = createStore(combineReducers(reducers), initialState);

    // TODO: добавить Redux DevTools для dev сборки

    store.dispatch({ type: '@@redux/INIT' });

    // TODO: добавить hot-reload

    return { store };
}

// eslint-disable-next-line import/no-default-export
export default configureStore;
