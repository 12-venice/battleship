import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
    Middleware,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import isServer from '../utils/serverSide/isServerEnvChecker';

function configureStore(reducers = {}, initialState = {}, options = {}) {
    const { isLogger } = options;

    const middlewares: Middleware[] = [thunkMiddleware];

    // добавить Redux DevTools для dev сборки. установить расширение в chrome
    const composeEnhancers =
        !isServer && isLogger && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            : compose;

    const store = createStore(
        combineReducers(reducers),
        initialState,
        composeEnhancers(applyMiddleware(...middlewares)),
    );

    store.dispatch({ type: '@@redux/INIT' });

    // TODO: добавить hot-reload

    return { store };
}

// eslint-disable-next-line import/no-default-export
export default configureStore;
