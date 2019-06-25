import cluster from 'cluster';
import os from 'os';
import app from './app';

if(cluster.isMaster) {
  // Masterプロセスの処理
  console.log(`Master ${process.pid} is running`);

  const clusterNum = (process.env.CLUSTER === '0' || Number.isNaN(Number(process.env.CLUSTER))) ? os.cpus().length : Number(process.env.CLUSTER);
  for(let i=0; i<clusterNum; i++) {
    cluster.fork(); // Workerプロセスを起動
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workerプロセスの処理
  app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %d pid', app.get('port'), process.pid);
  });
}
