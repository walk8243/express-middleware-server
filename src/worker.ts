import app from './app';
import { Server } from 'http';

export default function worker(): Server {
  // Workerプロセスの処理
  return app.listen(app.get('port'), listenCallback);
}

export function listenCallback() {
  console.log('App is running at http://localhost:%d in %d pid', app.get('port'), process.pid);
}
