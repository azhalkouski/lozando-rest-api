
import AppException from "../../exceptions/AppException";
// import ErrorLogger from "../ErrorLogger";


export function getDbException( err: unknown): AppException {
  const stack = err instanceof Error ? err.stack : new Error().stack;

  if (hasErrorCode(err)) {

    if (err.code === 'ECONNREFUSED') {
      const message = 'PostgreSQL ECONNREFUSED';
      return new AppException(message, 500, stack);
    }
  
    if (err.code === '42P01') {
      const message = 'PostgreSQL Table does not exist';
      return new AppException(message, 500, stack);
    }

  }

  const message = "Unknow error in PgDbService";
  return new AppException(message, 500, stack);
};


function hasErrorCode(err: unknown) {
  return typeof err === 'object' && err !== null && 'code' in err;
}
