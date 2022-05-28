import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { App } from './components/App/App';
import { configureStore } from './store/store';

export const store = configureStore(applyMiddleware(thunk));
if (typeof document !== 'undefined') {
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>,
        document.getElementById('root'),
    );
}
