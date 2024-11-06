import { Request, Response, NextFunction } from "express";

function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (process.env.API_KEY === apiKey){
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: invalid API Key' });
  }
};

export default apiKeyMiddleware;
