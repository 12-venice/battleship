/* eslint-disable no-console */
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './components/App';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root'),
);

window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                '../sw.js',
            );
            console.log('SW registered: ', registration);
        } catch (e) {
            console.log('SW registration failed: ', e);
        }
    }
});
