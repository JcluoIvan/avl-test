import * as express from 'express';
import { env } from './env';
export type ControllerCallback = (
    req: express.Request,
    res: express.Response,
    next?: express.NextFunction,
) => Promise<void>;

export const ctrlHandle = (cb: ControllerCallback): express.RequestHandler => {
    return (req, res, next) => cb(req, res, next).catch(next);
};

export const errorHandle = (err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const e = err || {};

    const data: any = {
        code: e.code || 0,
        message: e.message || 'server error',
    };
    if (env.isDev) {
        data.stack = (e.stack || '').split('\n');
    }

    res.status(e.status || 500).json(data);
};
