import express from 'express';
import * as path from 'path';
import * as fs from 'fs';

export const routerLib = {
  isServer,
  getRouterPath,
};

export default function getRouter(): express.Router {
  if(routerLib.isServer()) {
    return express.Router();
  } else {
    const appRouter = routerLib.getRouterPath();
    if(fs.statSync(appRouter).isFile()) {
      return require(appRouter).default;
    } else {
      throw new Error(`${appRouter} is not file!`);
    }
  }
}

function isServer(): boolean {
  if(process.env.SERVER == 'true' || process.env.ROUTER == 'false' || process.env.npm_package_config_router == 'false') {
    return true;
  }
  return false;
}

function getRouterPath(): string {
  return path.resolve(process.cwd(), process.env.ROUTER || process.env.npm_package_config_router || 'dist/router.js');
}
