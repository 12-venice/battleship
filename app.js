/* eslint-disable import/extensions */
// Конфликт линтеров
/* eslint-disable prettier/prettier */
// Ругается на наличие консоль лога и старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { httpServer } = require('./dist/server.js');
const mongoBase = 'mongodb+srv://admin:Edifier123@cluster0.pfe5h.mongodb.net/battleship?retryWrites=true&w=majority'
const PORT = 5000;

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