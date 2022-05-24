/* eslint-disable import/extensions */
// Конфликт линтеров
/* eslint-disable prettier/prettier */
// Ругается на наличие консоль лога и старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import path from 'path';
import express, {RequestHandler} from 'express';
import 'babel-polyfill';
import serverRenderMiddleware from './server-render-middleware';
import mongoose from 'mongoose';
import webpack from "webpack";
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import config from "../webpack/client.config";

// Эта функция возвращает middleware для локального девсервера и HMR
// Она должна работать только для режима разработки
function getWebpackMiddlewares(config: webpack.Configuration): RequestHandler[] {
    const compiler = webpack({...config, mode: 'development'});

    return [
        // Middleware для Webpack-билда проекта в реальном времени. Низкоуровневый аналог webpack-dev-server
        devMiddleware(compiler, {
            logLevel: 'error',
            publicPath: config.output!.publicPath!,
        }),
        // Middleware для HMR
        hotMiddleware(compiler, {path: `/__webpack_hmr`}),
    ];
}
const mongoBase = 'mongodb://usw2m9pivmflt8e3fgvc:DvcQrZQiBITI5QAR5zKK@blcazg7veeuyg88-mongodb.services.clever-cloud.com:27017/blcazg7veeuyg88';
const PORT = 5000;

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
    },
});

require('../socketRoutes/socket.js')(io);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/user', require('../serverRoutes/user.routes'));
app.use('/api/topic', require('../serverRoutes/topic.routes'));
app.use('/api/comment', require('../serverRoutes/comment.routes'));
app.use('/api/room', require('../serverRoutes/room.routes'));
app.use('/api/message', require('../serverRoutes/message.routes'));

app.use(express.static(path.resolve(__dirname, '../dist')))

app.get('/*', [...getWebpackMiddlewares(config)], serverRenderMiddleware);

export async function start() {
    try {
        mongoose.connect(mongoBase);
        httpServer.listen(process.env.PORT || PORT, () => {
            console.log(`Сервер запущен на порту: ${PORT}`);
        });
    } catch (e: any) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

