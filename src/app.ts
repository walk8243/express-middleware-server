import express from'express';
import bodyParser from 'body-parser';

import router from './router';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.use(router);

app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.sendStatus(500);
});

export default app;
