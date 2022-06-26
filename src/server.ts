/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import express from 'express';
import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import http from 'http';
import https from 'https';
import path from 'path';
import { Server, Socket } from 'socket.io';
import authRoutes from 'socketRoutes/auth.routes';
import inviteRoutes from 'socketRoutes/invite.routes';
import videoRoutes from 'socketRoutes/video.routes';
import mongoose from 'mongoose';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import { ExpressPeerServer } from 'peer';
import fs from 'fs';
import { DB, IS_DEV, IS_DEV_SERVER, PORT, SECRET_KEY } from '../webpack/env';
import { renderResponse } from './server/renderResponse';
import authRouter from '../serverRoutes/auth.routes';
import fileRouter from '../serverRoutes/file.routes';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';
import roomRouter from '../serverRoutes/room.routes';
import messageRouter from '../serverRoutes/message.routes';
import webpackConfig from '../webpack/client.config';
import { ISocket } from './server/types';
import {
    ClientToServerEvents,
    ServerToClientEvents,
} from './components/utils/Socket/types';

const compiler = webpack(webpackConfig);

const privateKey = fs.readFileSync('./src/sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync('./src/sslcert/localhost.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
if (IS_DEV && !IS_DEV_SERVER) {
    app.use(
        devMiddleware(compiler, {
            publicPath: webpackConfig?.output?.publicPath,
        }),
    );
    app.use(hotMiddleware(compiler));
}

const peerServer = ExpressPeerServer(httpsServer);
app.use('/peerjs', peerServer);
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpsServer,
    {
        cors: {
            origin: '*',
        },
    },
);

io.use((socket: ISocket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.jwtToken;
        if (!token) {
            return next(new Error('Пользователь не авторизован'));
        }
        jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
            if (err && err.name === 'TokenExpiredError') {
                return next(new Error('TokenExpiredError'));
            }
            if (decoded) {
                socket.userID = decoded.userId;
                next();
            } else {
                return next(new Error('Пользователь не распознан'));
            }
        });
    } catch (e) {
        return next(new Error('Нет авторизации'));
    }
});

io.on('connection', (socket: Socket) => {
    authRoutes(socket);
    inviteRoutes(socket);
    videoRoutes(socket);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/topic', topicRouter);
app.use('/api/comment', commentRouter);
app.use('/api/room', roomRouter);
app.use('/api/message', messageRouter);
app.use('/api/upload', fileRouter);

app.use(express.static(path.resolve(__dirname, '../dist')));
app.get('/*', renderResponse);

mongoose.connect(DB);
httpServer.listen(PORT, () => {
    console.log(
        `Сервер запущен в режиме ${IS_DEV ? 'РАЗРАБОТКИ' : 'ПРОДАКШЕН'}${
            IS_DEV_SERVER ? ' СЕРВЕРА' : ''
        } на порту: ${PORT}`,
    );
});

httpsServer.listen(5443, () => {
    console.log(
        `Сервер запущен в режиме ${IS_DEV ? 'РАЗРАБОТКИ' : 'ПРОДАКШЕН'}${
            IS_DEV_SERVER ? ' СЕРВЕРА' : ''
        } на порту: ${5443}`,
    );
});
