import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(resource: string, id?: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'NotFound',
        message: id ? `${resource} with id ${id} not found` : `${resource} not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'You do not have permission to perform this action') {
    super(
      { statusCode: HttpStatus.FORBIDDEN, error: 'Forbidden', message },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(
      { statusCode: HttpStatus.BAD_REQUEST, error: 'BadRequest', message },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      { statusCode: HttpStatus.CONFLICT, error: 'Conflict', message },
      HttpStatus.CONFLICT,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(
      { statusCode: HttpStatus.UNAUTHORIZED, error: 'Unauthorized', message },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
