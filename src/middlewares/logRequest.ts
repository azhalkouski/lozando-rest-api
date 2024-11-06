import { Request, Response, NextFunction } from 'express';

export function logRequest(req: Request, res: Response, next: NextFunction) {
  const { params, originalUrl, method } = req;
  console.log(
    `received req ${method}:${originalUrl}, params: ${JSON.stringify(params)}`
  );

  next();
};
