import {
  NOT_FOUND,
  ErrorCode,
  INTERNAL_SERVER,
  FORBIDDEN,
  UNAUTHORIZED,
  EXPIRED_TOKEN,
  MALFORMED_TOKEN,
  INVALID_TOKEN,
} from '.';

export const NotFoundException = (message?: string): ServiceException => {
  return new ServiceException(NOT_FOUND, message);
};

export const InternalServerException = (message?: string): ServiceException => {
  return new ServiceException(INTERNAL_SERVER, message);
};

export const ForbiddenException = (message?: string): ServiceException => {
  return new ServiceException(FORBIDDEN, message);
};

export const UnauthorizedException = (message?: string): ServiceException => {
  return new ServiceException(UNAUTHORIZED, message);
};

export const ExpiredTokenException = (message?: string): ServiceException => {
  return new ServiceException(EXPIRED_TOKEN, message);
};

export const MalformedTokenException = (message?: string): ServiceException => {
  return new ServiceException(MALFORMED_TOKEN, message);
};

export const InvalidTokenException = (message?: string): ServiceException => {
  return new ServiceException(INVALID_TOKEN, message);
};

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }

    super(message);

    this.errorCode = errorCode;
  }
}
