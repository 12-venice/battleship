import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import type { StaticRouterContext } from 'react-router';
import type { Request, Response } from 'express';
import configureStore from '../../src/store';
import reducers from '../../src/store/reducers';
import { getInitialState } from '../../src/store/getInitialState';
import App from '../../src/EmptyApp';

interface PageHtmlParams {
    bundleHtml: string;
    reduxState: {};
}

function getPageHtml(params: PageHtmlParams) {
    const { bundleHtml, reduxState } = params;

    const html = renderToStaticMarkup(
        <html lang="en">
            <head>
                {/* TODO: нет сборки стилей */}
                <link href="/main.css" rel="stylesheet" />
            </head>
            <body>
                <div
                    id="root"
                    dangerouslySetInnerHTML={{ __html: bundleHtml }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)}`,
                    }}
                />
                <script src="/main.js" />
            </body>
        </html>,
    );

    return `<!doctype html>${html}`;
}

// eslint-disable-next-line import/no-default-export
export default (req: Request, res: Response) => {
    const location = req.url;
    const context: StaticRouterContext = {};
    const { store } = configureStore(reducers, getInitialState(), { isLogger: false });

    const bundleHtml = renderToString(
        <ReduxProvider store={store}>
            <StaticRouter context={context} location={location}>
                <App />
            </StaticRouter>
        </ReduxProvider>,
    );

    // TODO: почему то пустой объект
    const reduxState = store.getState();

    if (context.url) {
        res.redirect(context.url);
        return;
    }

    res.status(context.statusCode || 200).send(
        getPageHtml({
            bundleHtml,
            reduxState,
        }),
    );
};
