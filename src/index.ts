import { configDotenv } from 'dotenv';
configDotenv();

import express, { Request, Response, NextFunction } from 'express';
import routes from './routes'
import logRequestMiddleware from './middlewares/logRequestMiddleware';
import apiKeyMiddleware from './middlewares/apiKeyMiddleware';
import AppException from './exceptions/AppException';
import logger from './utils/logger';


const PORT = process.env.port || 3000;

const app = express();


app.use(apiKeyMiddleware);

app.use('/api', logRequestMiddleware, routes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { message, stack } = err;
  logger.error(message, { stack });

  const statusCode = err instanceof AppException ? err.statusCode : 500;

  res.status(statusCode).send('Something broke!')
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
