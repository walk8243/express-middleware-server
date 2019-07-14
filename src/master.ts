import cluster from 'cluster';
import os from 'os';

export default function master() {
  // Masterプロセスの処理
  console.log(`Master ${process.pid} is running`);

  const clusterEnv = process.env.CLUSTER || process.env.npm_package_config_cluster || '0';
  const clusterNum = (clusterEnv === '0' || Number.isNaN(Number(clusterEnv))) ? os.cpus().length : Number(clusterEnv);
  for(let i=0; i<clusterNum; i++) {
    cluster.fork(); // Workerプロセスを起動
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}