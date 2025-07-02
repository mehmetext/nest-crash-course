import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();
    const reqUrl = req.originalUrl;

    const method = `${'\x1b[1m'}${req.method}${'\x1b[0m'}`;

    let statusCode: string;

    if (res.statusCode >= 200 && res.statusCode < 300) {
      statusCode = `\x1b[32m${res.statusCode}\x1b[0m`;
    } else {
      statusCode = `\x1b[31m${res.statusCode}\x1b[0m`;
    }

    res.on('finish', () => {
      const duration = performance.now() - start;
      console.log(
        `${method} ➜ ${reqUrl} | ${statusCode} | ${duration.toFixed(2)}ms`,
      );
    });

    next();
  }
}
