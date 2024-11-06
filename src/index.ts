import express from 'express';
import routes from './routes'
import { logRequest } from './middlewares/logRequest';

// TODO: 1) Setup PostgreSQL connection
// TODO: 2) Setup MongoDB connection
// TODO: 3) Setup async error handling middleware
// TODO: 4) Custom Exception class
// TODO: 5) Override default express error handing middleware
// TODO: 6) Setup winston logger

const PORT = process.env.port || 3000;

const app = express();

app.use('/api', logRequest, routes);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
