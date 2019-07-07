import app from './app';

export default function worker() {
  // Workerプロセスの処理
  app.listen(app.get('port'), listenCallback);
}

export function listenCallback() {
  console.log('App is running at http://localhost:%d in %d pid', app.get('port'), process.pid);
}
