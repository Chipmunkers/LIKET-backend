import { Request, Response } from "express";
import ResponseResult from "./ResponseResult";
import { URL } from "url";
import mongoClient from "./mongoClient";
import env from "../config/env";
import { verifyToken } from "./token";
import { Log } from "../types/Log";

export const insertLog = async (req: Request, res: Response, result: ResponseResult | string) => {
    try {
        const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
        const token = req.cookies;

        const logData: Log = {
            ip: req.ip,
            user: verifyToken(token) || '',
            method: req.method,
            path: url.pathname,
            query: url.search,
            body: hiddenBody(req.body),
            req_time: req.date,
            res_time: new Date(),
            status: Number(res.status),
            result: result,
            err: req.err
        }

        await mongoClient.db(env.mongoDatabase).collection('log').insertOne(logData);
    } catch (err) {
        console.log(err);
    }
}

const hiddenBody = (body: any) => {
    const hiddenKeys = ['pw'];

    for (const i in hiddenKeys) {
        if (body[hiddenKeys[i]]) {
            body[hiddenKeys[i]] = 'hidden';
        }
    }

    return body;
}
