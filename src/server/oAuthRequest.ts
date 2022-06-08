/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
import https from 'https';
import queryString from 'query-string';
import { YANDEX_ID, YANDEX_PASSWORD } from '../../webpack/env';

const getToken = (code: string, onResult: Function) => {
    const postData = queryString.stringify({
        grant_type: 'authorization_code',
        code,
    });
    const base64encodedData = Buffer.from(
        `${YANDEX_ID}:${YANDEX_PASSWORD}`,
    ).toString('base64');
    const options = {
        host: 'oauth.yandex.ru',
        port: 443,
        path: '/token',
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64encodedData}`,
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    let output = '';

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            const obj = JSON.parse(output);
            onResult(obj);
        });
    });

    req.write(postData);

    req.on('error', (err: Error) => {
        console.log(`error: ${err.message}`);
    });

    req.end();
};

const getUserInfo = (
    tokenType: string,
    token: string,
    onResult: Function,
) => {
    const postData = queryString.stringify({
        format: 'json',
    });
    const options = {
        host: 'login.yandex.ru',
        method: 'GET',
        path: '/info',
        headers: {
            Authorization: `${tokenType} ${token}`,
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
    };
    let output = '';
    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            const obj = JSON.parse(output);
            onResult(obj);
        });
    });

    req.write(postData);

    req.on('error', (err: Error) => {
        console.log(`error: ${err.message}`);
    });

    req.end();
};


export const OauthUser = (code: string) => {
    getToken(
        code,
        (result: { access_token: string; token_type: string }) => {
            if (result.token_type && result.access_token) {
                getUserInfo(
                    result.token_type,
                    result.access_token,
                    async (user: {
                        email: string;
                        default_email?: string;
                        phone: string;
                        default_phone?: string;
                        id: string;
                    }) => {
                        // переименование полей для стандартизации User
                        if (user.default_email) {
                            user.email = user.default_email;
                            delete user.default_email;
                        }
                        if (user.default_phone) {
                            user.phone = user.default_phone;
                            delete user.default_phone;
                        }
                        console.log(user)
                    },
                );
            }
        },
    );
}