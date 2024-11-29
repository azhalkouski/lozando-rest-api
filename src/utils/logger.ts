import winston, { level } from "winston";
import "winston-mongodb";

const MONGODB_HOST = process.env.MONGODB_DATABASE_HOST;
const MONGODB_NAME = process.env.MONGODB_DATABASE_NAME;
const MONGODB_PORT = process.env.MONGODB_DATABASE_PORT;
const ERROR_LOGS_COLLECTION = `${process.env.ERROR_LOGS_COLLECTION}`;
const WARNING_LOGS_COLLECTION = process.env.WARNING_LOGS_COLLECTION;

if (!MONGODB_HOST || !MONGODB_PORT || !MONGODB_NAME) {
  throw new Error('Missing config data for MongoDB');
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'lozando-rest-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log', level: 'info' }),
    new winston.transports.MongoDB({
      level: 'error',
      db: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`,
      collection: ERROR_LOGS_COLLECTION,
    }),
    new winston.transports.MongoDB({
      level: 'warn',
      db: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`,
      collection: WARNING_LOGS_COLLECTION,
    }),
  ]
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

export default logger;
