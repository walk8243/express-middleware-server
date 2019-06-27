import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';

// ルーターを呼び出し
const appRouter = path.resolve(process.cwd(), 'dist/router.js');
const routerPath = fs.statSync(appRouter).isFile() ? appRouter : './router';
const router = require(routerPath).default;

const app = express();

// ルーター前に使用するミドルウェア
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

// ルーターを使用
app.use(router);

// ルーター後に使用するミドルウェア
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.sendStatus(500);
});

export default app;
