/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { PROPS } from './types';

const OAUTH_ID = '085740c0f5614f93a07ce6b4c4246a65';

const getYandexAuthUrl = (redirectUrl: string) => {
    let requestUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${OAUTH_ID}`;
    requestUrl += `&redirect_uri=${window.location.origin}${redirectUrl}`;
    requestUrl += '&force_confirm=yes';
    return requestUrl;
};

export const YandexLogin = (props: PROPS) => {
    const onClick = () => {
        sessionStorage.setItem('yandexAutoLoginDisabled', 'false');
        window.location.href = getYandexAuthUrl(props.currentUrl);
    };
    return <div>{React.cloneElement(props.children, { onClick })}</div>;
};
