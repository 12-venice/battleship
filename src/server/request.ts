/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
import http from 'http';
import https from 'https';

type optionsType = {
    host: string;
    port: number;
    path: string;
    method: 'GET' | 'POST';
    headers: {};
};

const OAUTH_ID = '085740c0f5614f93a07ce6b4c4246a65';

export const getJSON = (token: string, onResult: Function) => {
    const options = {
        host: `https://oauth.yandex.ru/authorize?response_type=token&client_id=${OAUTH_ID}`,
        port: 443,
        path: '/some/path',
        method: 'GET',
        headers: {
            Authorization: `OAuth ${token}`,
        },
    };
    console.log('rest::getJSON');
    const port = options.port === 443 ? https : http;

    let output = '';

    const req = port.request(options, (res) => {
        console.log(`${options.host} : ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            const obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err: Error) => {
        console.log(`error: ${err.message}`);
    });

    req.end();
};
