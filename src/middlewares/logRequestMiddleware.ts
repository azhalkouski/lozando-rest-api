import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

function logRequestMiddleware(req: Request, res: Response, next: NextFunction) {
  const { params, originalUrl, method } = req;
  logger.info(
    `received req ${method}:${originalUrl}, params: ${JSON.stringify(params)}`
  );

  next();
};

export default logRequestMiddleware;
