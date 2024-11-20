class AppException extends Error {
  statusCode: number;
  debugInfo: string;
  stack: string | undefined;

  constructor(
    message: string,
    statusCode: number,
    debugInfo: string,
    stack: string | undefined
  ) {
    super(message);
    this.statusCode = statusCode;
    this.debugInfo = debugInfo;
    this.stack = stack;
  }
};

export default AppException;
