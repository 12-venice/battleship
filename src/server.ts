import express from 'express';
import 'babel-polyfill';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import socketio from '../socketRoutes/socket';
import { requestHandler } from './components/server/server-render-middleware';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';
import roomRouter from '../serverRoutes/room.routes';
import messageRouter from '../serverRoutes/message.routes';

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
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
app.get('/*', requestHandler);

export { httpServer };
