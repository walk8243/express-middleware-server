import express from 'express';
import * as path from 'path';
import * as fs from 'fs';

let router!: express.Router;
if(process.env.ROUTER == 'false' || process.env.npm_package_config_router == 'false') {
  router = express.Router();
} else {
  const appRouter = path.resolve(process.cwd(), process.env.ROUTER || process.env.npm_package_config_router || 'dist/router.js');
  if(fs.statSync(appRouter).isFile()) {
    router = require(appRouter).default;
  } else {
    throw new Error(`${appRouter} is not exists!`);
  }
}

export default router;
