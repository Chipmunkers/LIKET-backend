import express, { NextFunction, Request, Response } from 'express';
import ResponseResult from './utils/ResponseResult';
import authRouter from './routers/auth.router';
import cookieParser from 'cookie-parser';
import { NotFoundException } from './utils/Exception';
import corsConfig from './config/cors.config';
import cors from 'cors';
import logging from './middleware/logging.mw';
import logRouter from './routers/log.router';

const app = express();

app.use(logging());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.use('/auth', authRouter);
app.use('/log', logRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    return next(new NotFoundException('잘못된 경로입니다.'));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const result = new ResponseResult(err);
    req.err = err;

    res.status(result.status).send(result);
});

export default app;
