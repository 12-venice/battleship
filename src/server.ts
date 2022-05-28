import express, { RequestHandler } from 'express';
import 'babel-polyfill';
import http from 'http';
import path from 'path';

import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import socketio from '../socketRoutes/socket';
import serverRenderMiddleware from './components/server/server-render-middleware';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';
import roomRouter from '../serverRoutes/room.routes';
import messageRouter from '../serverRoutes/message.routes';

import config from '../webpack/client.config';

function getWebpackMiddlewares(
    config: webpack.Configuration,
): RequestHandler[] {
    const compiler = webpack({ ...config, mode: 'development' });

    return [
        // Middleware для Webpack-билда проекта в реальном времени. Низкоуровневый аналог webpack-dev-server
        devMiddleware(compiler, {
            // logLevel: 'error',
            publicPath: config.output!.publicPath!,
        }),
        // Middleware для HMR
        hotMiddleware(compiler, { path: '/__webpack_hmr' }),
    ];
}

const app = express();

const httpServer = http.createServer(app);

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
    },
});

socketio(io);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/user', userRouter);
app.use('/api/topic', topicRouter);
app.use('/api/comment', commentRouter);
app.use('/api/room', roomRouter);
app.use('/api/message', messageRouter);

app.use(express.static(path.resolve(__dirname, '../dist')));
app.get('/*', [...getWebpackMiddlewares(config)], serverRenderMiddleware);

export { httpServer };
