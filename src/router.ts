import express from 'express';
import * as path from 'path';
import * as fs from 'fs';

const appRouter = path.resolve(process.cwd(), process.env.ROUTER || process.env.npm_package_config_router || 'dist/router.js');
const router = fs.statSync(appRouter).isFile() ? require(appRouter).default : express.Router();

export default router;
