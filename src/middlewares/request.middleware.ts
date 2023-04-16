import { Request, Response, NextFunction } from 'express';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../modules/auth/auth.service';

interface CustomRequest extends Request {
    user?: any;
}

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    constructor(
        private readonly jwt: JwtService,
        private readonly authService: AuthService,
    ) {}

    async use(req: CustomRequest, res: Response, next: NextFunction) {
        const authedUser = await this._decodeToken(req);
        if (authedUser) {
            req.user = authedUser;
        }

        next();
    }

    async _decodeToken(req: CustomRequest) {
        try {
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = await this.jwt.verify(token);
                if (decoded) {
                    return await this.authService.getUserRole(decoded._id);
                }
            }

            return null;
        } catch (err) {
                console.log(`Error on _checklogin ${err}`);
                return null;
        }
    }
}
