/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import { PROPS } from './types';

const OAUTH_ID = '085740c0f5614f93a07ce6b4c4246a65';
const YandexHiddenFrame = (props: { redirectTo: string | undefined }) => (
    <iframe hidden title="yandex-hidden-frame" src={props.redirectTo} />
);

const checkAccessKey = () => {
    const token = /access_token=([^&]+)/.exec(document.location.hash);
    if (!token) {
        return null;
    }
    console.log(token);
    return token[1];
};

const getYandexAuthUrl = (redirectUrl: string) => {
    let requestUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${OAUTH_ID}`;
    requestUrl += `&redirect_uri=${window.location.origin}${redirectUrl}`;
    return requestUrl;
};

export const YandexLogin = (props: PROPS) => {
    const handleMessageFromPopup = (event: {
        data: { source: string; payload: {} };
    }) => {
        if (event.data.source === 'yandex-login') {
            props.onSuccess(event.data.payload);
        }
    };

    const onClick = () => {
        sessionStorage.setItem('yandexAutoLoginDisabled', 'false');
        const requestUrl = getYandexAuthUrl(props.currentUrl);

        const h = 650;
        const w = 550;
        const y = window!.top!.outerHeight / 2 + window!.top!.screenY - h / 2;
        const x = window!.top!.outerWidth / 2 + window!.top!.screenX - w / 2;
        window.open(
            requestUrl,
            'popup',
            `width=${w},height=${h},top=${y},left=${x}`,
        );

        window.addEventListener('message', handleMessageFromPopup, {
            once: true,
        });
    };

    let frameRedirectTo = null;

    const aki = checkAccessKey();
    const receiver = window.parent !== window ? window.parent : window.opener;

    useEffect(() => {
        if (aki && receiver) {
            receiver.postMessage(
                {
                    source: 'yandex-login',
                    payload: aki,
                },
                window.location.origin,
            );
            window.close();
        }
    });

    if (!aki && !receiver) {
        const autoLoginDIsabled = sessionStorage.getItem(
            'yandexAutoLoginDisabled',
        );

        frameRedirectTo =
            autoLoginDIsabled !== 'true'
                ? getYandexAuthUrl(props.currentUrl)
                : null;

        window.addEventListener('message', handleMessageFromPopup, {
            once: false,
        });
    }

    return (
        <div>
            {React.cloneElement(props.children, { onClick })}
            {frameRedirectTo && (
                <YandexHiddenFrame redirectTo={frameRedirectTo} />
            )}
        </div>
    );
};
