import { Logger } from '@nestjs/common';
import { ServiceResponseType } from './service.response';

import { V100, X_CORRELATION_ID } from '../constants/constant.header';

export default class ControllerResponse {
    protected readonly logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }
    
    public generate = (
        request: Request,
        response: any,
        result: ServiceResponseType,
    ) => {
        this.logger.log(
            `[${request.headers[X_CORRELATION_ID]}] Response Body: ${JSON.stringify(
                result,
            )}`,
        );
        return response
        .header({
            version: V100,
            [X_CORRELATION_ID]: request.headers[X_CORRELATION_ID],
        })
        .status(result.code)
        .json(result);
    };
}
