import { NextFunction, Request, Response } from "express";
import ResponseResult from "../utils/ResponseResult";
import validator from "../utils/validator";
import { idRegExp } from "../utils/regExp";
import prisma from "../utils/prisma";
import { compareHash } from "../utils/hash";
import { createToken } from "../utils/token";
import { BadRequestException, ConflictException } from "../utils/Exception";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    //from FE
    const inputId = req.body.id || null;
    const inputPw = req.body.pw || null;

    //to FE
    const result = new ResponseResult();

    //validation check
    if (!validator(inputId).isString().testRegExp(idRegExp).end()) {
        return next(new BadRequestException('아이디 또는 비밀번호가 없습니다.'));
    }

    //main
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: inputId,
                deletedAt: null
            },
            select: {
                pw: true,
                userIdx: true
            }
        });

        if (!user) {
            return next(new BadRequestException('존재하지 않는 아이디입니다.'));
        }

        if (!compareHash(inputPw, user.pw)) {
            return next(new BadRequestException('비밀번호가 잘못되었습니다.'));
        }

        const token = createToken({
            userIdx: user.userIdx
        });

        res.cookie('token', token);
    } catch (err) {
        return next(new ConflictException('예상하지 못한 에러가 발생했습니다.', err));
    }

    //send result
    res.status(result.status).send(result);
}
