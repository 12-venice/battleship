import * as React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { App } from './components/App/App';
import { configureStore } from './store/store';
import {State} from "./types/index";

export const store = configureStore(applyMiddleware(thunk));

declare global {
    interface Window {
      __INITIAL_STATE__: State;
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
    }
  }

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
