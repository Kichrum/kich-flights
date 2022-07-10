import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ERROR_BY_CODE } from '../constants/errors.constants';

@Catch(Error)
export class ErrorFilter extends BaseExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const exception = new HttpException(
      ERROR_BY_CODE[error.message] || error.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );

    super.catch(exception, host);
  }
}
