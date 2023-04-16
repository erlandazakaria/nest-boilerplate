import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { NestMiddleware, Injectable } from '@nestjs/common';

import {
  DEFAULT_VERSION,
  VERSION,
  X_CORRELATION_ID,
} from '../constants/constant.header';

interface CustomHeaders {
  [VERSION]?: string;
  [X_CORRELATION_ID]?: string;
}

interface CustomRequest extends Request {
  headers: IncomingHttpHeaders & CustomHeaders;
  user?: any;
}

@Injectable()
export class CommonRequestMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.headers[VERSION]) {
      req.headers[VERSION] = DEFAULT_VERSION;
    }

    if (!req.headers[X_CORRELATION_ID]) {
      req.headers[X_CORRELATION_ID] = String(Date.now());
    }

    next();
  }
}
