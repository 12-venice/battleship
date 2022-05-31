import express, { RequestHandler } from 'express';
import 'babel-polyfill';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { requestHandler } from './components/server/server-render-middleware';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';
import roomRouter from '../serverRoutes/room.routes';
import messageRouter from '../serverRoutes/message.routes';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import config from '../webpack/server.config';
import authRoutes from 'socketRoutes/auth.routes';
import messageRoutes from 'socketRoutes/message.routes';
import inviteRoutes from 'socketRoutes/invite.routes';

const getWebpackMiddlewares = (
    config: webpack.Configuration,
): RequestHandler[] => {
    const compiler = webpack(config);
    return [
        devMiddleware(compiler, {
            publicPath: config.output?.publicPath,
            serverSideRender: true
        }),
        hotMiddleware(compiler),
    ];
};

const app = express();
const httpServer = http.createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
        cors: {
            origin: '*',
        },
    },
);
io.on('connection', (socket: Socket) => {
    console.log(socket.id);
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
app.get('/*', [...getWebpackMiddlewares(config)], requestHandler);

export { httpServer };
