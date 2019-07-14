import express from 'express';
import bodyParser from 'body-parser';
import { notFoundErrorHandler, errorHandler } from './middleware';

// ルーターを呼び出し
import getRouter from './router';

const app = express();

/* ここから アプリケーションの設定 */
app.set('port', Number(process.env.PORT) || Number(process.env.npm_package_config_port) || 3000);
/* ここまで アプリケーションの設定 */

/* ここから ルーター前に使用するミドルウェア */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* ここまで ルーター前に使用するミドルウェア */

// ルーターを使用
app.use(getRouter());

/* ここから ルーター後に使用するミドルウェア */
app.use(notFoundErrorHandler);
app.use(errorHandler);
/* ここまで ルーター後に使用するミドルウェア */

export default app;
