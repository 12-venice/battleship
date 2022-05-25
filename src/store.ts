// TODO: дублируется код из src/store/store.ts . потом отрефачить
import { combineReducers, createStore } from 'redux';

function configureStore(reducers = {}, initialState = {}, options = {}) {
    const store = createStore(combineReducers(reducers), initialState);

    // TODO: добавить Redux DevTools для dev сборки

    store.dispatch({ type: '@@redux/INIT' });

    // TODO: добавить hot-reload

    return { store };
}

export default configureStore;
