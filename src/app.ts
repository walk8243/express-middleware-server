import express from 'express';
import bodyParser from 'body-parser';

// ルーターを呼び出し
import router from './router';

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
