import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'babel-polyfill';
import { App } from './components/App';
import { configureStore } from './store/store';
import { State } from './store/types';

const { store, history } = configureStore(window.__INITIAL_STATE__);

declare global {
    interface Window {
        __INITIAL_STATE__: State;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
    }
}

ReactDOM.hydrate(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
);
