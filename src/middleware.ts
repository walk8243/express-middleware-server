import { Request, Response, NextFunction } from 'express';

export function notFoundErrorHandler(req: Request, res: Response, next: NextFunction) {
  res.sendStatus(404);
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.sendStatus(500);
}
