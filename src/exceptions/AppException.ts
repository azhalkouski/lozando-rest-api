class AppException extends Error {
  statusCode: number;
  stack: string | undefined;

  constructor(
    message: string,
    statusCode: number,
    stack: string | undefined
  ) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
  }
};

export default AppException;
