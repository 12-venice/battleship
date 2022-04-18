import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './components/App';
import { configureStore } from './store/store';

const store = configureStore({});

console.log(store.getState());
console.log(store.getState().user);

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root'),
);
