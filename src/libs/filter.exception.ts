import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();
        let exceptionResponseObj: any;

        if (status === 404) {
            response.status(status).json({
                code: status,
                message: 'Server Not Found',
            });
        } else {
            if (typeof exceptionResponse === 'object') {
                exceptionResponseObj = exceptionResponse;
            } else if (exceptionResponse) {
                exceptionResponseObj = { message: [exceptionResponse] };
            } else {
                exceptionResponseObj = { message: ['Error'] };
            }

            response.status(status).json({
              code: status,
              message: exceptionResponseObj.message[0],
            });
        }
    }
}
