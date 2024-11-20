import { Request, Response, NextFunction } from "express"

type middlewareFn = (req: Request, res: Response, next: NextFunction) => void;

function withAsyncCatchMiddleware(asyncFunction: middlewareFn) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch(next);
  }
};

export default withAsyncCatchMiddleware;
