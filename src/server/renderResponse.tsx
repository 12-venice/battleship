import { renderToString } from 'react-dom/server';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '../store/store';
import { App } from '../components/App';
import { getHtml } from './html';

export const renderResponse = (req: Request, res: Response) => {
    const store = configureStore();
    const jsx = (
        <ReduxProvider store={store}>
            <StaticRouter location={req.url}>
                <App />
            </StaticRouter>
        </ReduxProvider>
    );
    const reactHtml = renderToString(jsx);
    const reduxState = store.getState();

    res.send(getHtml(reactHtml, reduxState));
};
