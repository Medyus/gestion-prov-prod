import { ArgumentsHost, Catch, ExceptionFilter, ValidationError } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = JSON.parse(JSON.stringify(exception));
    const message = error.errors.type.message;
    response.status(400).json({
      statusCode: 400,
      message: message
    });
  }
}