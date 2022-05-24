/* eslint-disable import/extensions */
// Конфликт линтеров
/* eslint-disable prettier/prettier */
// Ругается на наличие консоль лога и старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const socket = require('socket.io');
const http = require('http');
const { App } = require('./src/components/App/App');

const mongoBase = 'mongodb://usw2m9pivmflt8e3fgvc:DvcQrZQiBITI5QAR5zKK@blcazg7veeuyg88-mongodb.services.clever-cloud.com:27017/blcazg7veeuyg88';
const PORT = 5000;

const app = express();
const httpServer = http.createServer(app);

const io = socket(httpServer, {
    cors: {
        origin: '*',
    },
});

require('./socketRoutes/socket.js')(io);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/user', require('./serverRoutes/user.routes'));
app.use('/api/topic', require('./serverRoutes/topic.routes'));
app.use('/api/comment', require('./serverRoutes/comment.routes'));
app.use('/api/room', require('./serverRoutes/room.routes'));
app.use('/api/message', require('./serverRoutes/message.routes'));

app.get('^/$', (req, res) => {
    const appHTML = ReactDOMServer.renderToString(<App />);

    const indexFile = path.resolve('./dist/index.html');
    fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err);
            return res.status(500).send('Oops, better luck next time!');
        }

        return res.send(
            data.replace(
                '<div id="root"></div>',
                `<div id="root">${appHTML}</div>`,
            ),
        );
    });
});

app.use(express.static(path.resolve(__dirname, 'dist')));

async function start() {
    try {
        mongoose.connect(mongoBase);
        httpServer.listen(process.env.PORT || PORT, () => {
            console.log(`Сервер запущен на порту: ${PORT}`);
        });
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
