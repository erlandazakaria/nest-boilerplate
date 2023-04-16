import { Logger } from '@nestjs/common';
import ControllerResponse from './controller.response';
import { VERSION, X_CORRELATION_ID } from '../constants/constant.header';

export default abstract class BaseController {
    protected readonly response: ControllerResponse;
    protected readonly logger: Logger;

    constructor(name: string) {
        this.logger = new Logger(name);
        this.response = new ControllerResponse(this.logger);
    }

    public printRequestDetail(request: any, params: any, body: any) {
        this.logger.log(
            `[${request.headers[X_CORRELATION_ID]}] Endpoint: ${request.method} ${request.url} V${request.headers[VERSION]}`,
        );
        this.logger.log(
            `[${request.headers[X_CORRELATION_ID]}] JWT user: ${
                request.user ? JSON.stringify(request.user) : JSON.stringify({})
            }`,
        );
        this.logger.log(
            `[${request.headers[X_CORRELATION_ID]}] Request Params: ${
                request.params ? JSON.stringify(params) : JSON.stringify({})
            }`,
        );
        this.logger.log(
            `[${request.headers[X_CORRELATION_ID]}] Request Body: ${
                request.body ? JSON.stringify(body) : JSON.stringify({})
            }`,
        );
    }
}
