/* eslint-disable import/extensions */
// Конфликт линтеров
/* eslint-disable prettier/prettier */
// Ругается на наличие консоль лога и старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const mongoBase = 'mongodb://usw2m9pivmflt8e3fgvc:DvcQrZQiBITI5QAR5zKK@blcazg7veeuyg88-mongodb.services.clever-cloud.com:27017/blcazg7veeuyg88';
const PORT = 5000;

const app = express();
const server = require('http').createServer(app);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/user', require('./serverRoutes/user.routes'));
app.use('/api/topic', require('./serverRoutes/topic.routes'));
app.use('/api/comment', require('./serverRoutes/comment.routes'));

app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

async function start() {
    try {
        mongoose.connect(mongoBase);
        server.listen(process.env.PORT || PORT, () => {
            console.log(`Сервер запущен на порту: ${PORT}`);
        });
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
