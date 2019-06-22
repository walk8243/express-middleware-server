import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

import app from "./app";

if(cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const clusterEnv = (process.env.CLUSTER === '0' || Number.isNaN(Number(process.env.CLUSTER))) ? Number.MAX_SAFE_INTEGER : Number(process.env.CLUSTER);
  const clusterNum = numCPUs > clusterEnv ? clusterEnv : numCPUs;
  for(let i=0; i<clusterNum; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(app.get("port"), () => {
    console.log('App is running at http://localhost:%d in %d pid', app.get("port"), process.pid);
  });
}
