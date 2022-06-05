/* eslint-disable no-console */
import express from 'express';
import 'babel-polyfill';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import authRoutes from 'socketRoutes/auth.routes';
import messageRoutes from 'socketRoutes/message.routes';
import inviteRoutes from 'socketRoutes/invite.routes';
import mongoose from 'mongoose';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import { DB, IS_DEV, IS_DEV_SERVER, PORT } from '../webpack/env.ts';
import { renderResponse } from './server/renderResponse';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';
import roomRouter from '../serverRoutes/room.routes';
import messageRouter from '../serverRoutes/message.routes';
import webpackConfig from '../webpack/client.config';

const compiler = webpack(webpackConfig);

const app = express();
const httpServer = http.createServer(app);
if (IS_DEV && !IS_DEV_SERVER) {
    app.use(
        devMiddleware(compiler, {
            publicPath: webpackConfig?.output?.publicPath,
        }),
    );
    app.use(hotMiddleware(compiler));
}
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
        cors: {
            origin: '*',
        },
    },
);
io.on('connection', (socket: Socket) => {
    authRoutes(socket);
    messageRoutes(socket);
    inviteRoutes(socket);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/user', userRouter);
app.use('/api/topic', topicRouter);
app.use('/api/comment', commentRouter);
app.use('/api/room', roomRouter);
app.use('/api/message', messageRouter);

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
