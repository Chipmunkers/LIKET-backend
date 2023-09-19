import { NextFunction, Request, Response } from "express";
import ResponseResult from "../utils/ResponseResult";
import validator from "../utils/validator";
import { BadRequestException, ConflictException } from "../utils/Exception";
import mongoClient from "../utils/mongoClient";
import env from "../config/env";

export const getLogAll = async (req: Request, res: Response, next: NextFunction) => {
    //from FE
    const offset = req.query.offset || 0;
    const limit = Number(req.query.limit || 100);
    const searchUser = req.query.user || null;
    const searchMethod = req.query.method || null;
    const searchPath = req.query.path || null;
    const searchStatus = req.query.status || null;

    //to FE
    const result = new ResponseResult();

    //validation check
    if (!validator(offset).isNumber().range(0).end()) {
        return next(new BadRequestException('offset 데이터가 유효하지 않습니다.'));
    }
    if (!validator(limit).isNumber().range(1).end()) {
        return next(new BadRequestException('limit 데이터가 유효하지 않습니다.'));
    }

    //main
    try {
        const mongoQuery: any = {};
        if (searchUser) {
            mongoQuery.user = searchUser;
        }
        if (searchMethod) {
            mongoQuery.method = searchMethod;
        }
        if (searchPath) {
            mongoQuery.path = searchPath;
        }
        if (searchStatus) {
            mongoQuery
        }

        result.data = await mongoClient.db(env.mongoDatabase).collection('log').find(mongoQuery).limit(limit).sort({
            req_time: -1
        }).toArray();
    } catch (err) {
        return next(new ConflictException('예상하지 못한 에러가 발생했습니다.', err));
    }

    //send result
    res.status(result.status).send(result);
}
