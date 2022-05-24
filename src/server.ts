import path from 'path';
import express from 'express';
// import 'babel-polyfill';
// import webpack from 'webpack';
// import devMiddleware from 'webpack-dev-middleware';
// import hotMiddleware from 'webpack-hot-middleware';
// import config from "../webpack/client.config";
import mongoose from 'mongoose';
import http from 'http';
import serverRenderMiddleware from './components/server/server-render-middleware';
import userRouter from '../serverRoutes/user.routes';
import topicRouter from '../serverRoutes/topic.routes';
import commentRouter from '../serverRoutes/comment.routes';

// Эта функция возвращает middleware для локального девсервера и HMR
// Она должна работать только для режима разработки
// function getWebpackMiddlewares(config: webpack.Configuration): RequestHandler[] {
//     const compiler = webpack({...config, mode: 'development'});

//     return [
// eslint-disable-next-line max-len
//         // Middleware для Webpack-билда проекта в реальном времени. Низкоуровневый аналог webpack-dev-server
//         devMiddleware(compiler, {
//             logLevel: 'error',
//             publicPath: config.output!.publicPath!,
//         }),
//         // Middleware для HMR
//         hotMiddleware(compiler, {path: `/__webpack_hmr`}),
//     ];
// }

const mongoBase =
    'mongodb://usw2m9pivmflt8e3fgvc:DvcQrZQiBITI5QAR5zKK@blcazg7veeuyg88-mongodb.services.clever-cloud.com:27017/blcazg7veeuyg88';
const PORT = 5000;

const app = express();

const server = http.createServer(app);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use('/api/user', userRouter);
// app.use('/api/topic', topicRouter);
// app.use('/api/comment', commentRouter);

app.use('/', express.static(path.join(__dirname, 'dist')));

// На все get запросы запускаем сначала middleware dev server,
// а потом middleware рендеринга приложения
app.get('/*', serverRenderMiddleware);

export { app };

// async function start() {
//     try {
//         mongoose.connect(mongoBase);
//         server.listen(process.env.PORT || PORT, () => {
//             console.log(`Сервер запущен на порту: ${PORT}`);
//         });
//     } catch (e) {
//         console.log('Server Error', e.message);
//         process.exit(1);
//     }
// }

// start();
