import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import type { StaticRouterContext } from 'react-router';
import type { Request, Response } from 'express';
import { configureStore } from '../../src/store/store';
import { getInitialState } from '../../src/store/getInitialState';
import { App } from '../../src/components/App';

function getHtml(reactHtml: string, reduxState = {}) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="google-site-verification" content="nLL5VlSAgcKL756luG6o6UwKcvR8miU2duRnhU-agmE" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="shortcut icon" type="image/png" href="/images/favicon.png">
            <title>Sneakers shop</title>
            <link href="/main.css" rel="stylesheet">
        </head>
        <body>
            <div id="mount">${reactHtml}</div>
            <script>
                // Записываем состояние редакса, сформированное на стороне сервера в window
                // На стороне клиента применим это состояние при старте
                window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)}
            </script>
            <script src="/main.js"></script>
        </body>
        </html>
    `;
}

// В этой middleware мы формируем первичное состояние приложения на стороне сервера
// Попробуйте её подебажить, чтобы лучше разобраться, как она работает
// eslint-disable-next-line import/no-default-export
export default (req: Request, res: Response) => {
    const location = req.url;
    const context: StaticRouterContext = {};
    const { store } = configureStore(getInitialState(location), location);

    const jsx = (
        <ReduxProvider store={store}>
            <StaticRouter context={context} location={location}>
                <App />
            </StaticRouter>
        </ReduxProvider>
    );
    const reactHtml = renderToString(jsx);
    const reduxState = store.getState();

    if (context.url) {
        res.redirect(context.url);
        return;
    }

    res.status(context.statusCode || 200).send(getHtml(reactHtml, reduxState));
};
