class ErrorCodeVo {
  readonly status;
  readonly message;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const NOT_FOUND = new ErrorCodeVo(404, 'Not Found');
export const INTERNAL_SERVER = new ErrorCodeVo(500, 'Internal Server Error');
export const FORBIDDEN = new ErrorCodeVo(403, 'Forbidden');
export const UNAUTHORIZED = new ErrorCodeVo(401, 'Unauthorized');
export const MALFORMED_TOKEN = new ErrorCodeVo(401, 'Malformed token');
export const INVALID_TOKEN = new ErrorCodeVo(401, 'Invalid signature');
export const EXPIRED_TOKEN = new ErrorCodeVo(401, 'Expired token');
