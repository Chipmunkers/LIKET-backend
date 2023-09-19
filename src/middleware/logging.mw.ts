import express, { NextFunction, Request, Response } from "express"
import ResponseResult from "../utils/ResponseResult";
import { insertLog } from "../utils/log";

const logging = (): express.RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const oldSend = res.send;
        req.date = new Date();

        res.send = (result: ResponseResult | string) => {
            if (typeof (result) === 'object' && req.originalUrl.split('/')[1] !== 'log') {
                insertLog(req, res, result);
            } else if (typeof (result) === 'object' && req.originalUrl.split('/')[1] === 'log') {
                insertLog(req, res, 'hidden');
            }
            return oldSend.apply(res, [result]);
        }

        next();
    }
}

export default logging;
