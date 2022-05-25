import React from 'react';
import { hydrate } from 'react-dom';
import { Helmet } from 'react-helmet';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';

import { EmptyApp as Core } from '../EmptyApp';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
    data?: {}; // TODO: Your types from server
}

const Bundle = ({ data = {} }: Props) => (
    <>
        <Helmet>
            <html lang="ru" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            />
        </Helmet>

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Core {...data} />
    </>
);

export const DesktopBundle = hot(Bundle);

hydrate(
    <BrowserRouter>
        <DesktopBundle />
    </BrowserRouter>,
    document.getElementById('root'),
);
