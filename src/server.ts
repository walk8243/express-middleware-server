import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

import app from "./app";

if(cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for(let i=0; i<numCPUs; i++) {
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
