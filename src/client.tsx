// @ts-nocheck
/* eslint-disable import/no-import-module-exports */
import { hydrate, render } from 'react-dom';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './components/App/App';
import { store } from './store/store';

const renderMethod = module.hot ? render : hydrate;

renderMethod(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);

if (module.hot) {
    module.hot.accept();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(() => {
                console.log('SW registered');
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
