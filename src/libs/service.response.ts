import { HttpStatus } from '@nestjs/common';

export default class ServiceResponse {
    public success = (message?: string) => {
        return {
            code: HttpStatus.OK,
            message: message ?? 'Success',
        };
    };

    public successWithData = (data: any = {}, message?: string) => {
        return {
            code: HttpStatus.OK,
            message: message ?? 'Success',
            data: data,
        };
    };

    public error = (code: number, message?: string) => {
        return {
            code,
            message: message ?? 'Error',
        };
    };

    public unauthorized = () => {
        return {
            code: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
        };
    };

    public badRequest = () => {
        return {
            code: HttpStatus.BAD_REQUEST,
            message: 'Bad Request',
        };
    };
}

export type ServiceResponseType = {
    code: number;
    message?: string;
    data?: any;
};
