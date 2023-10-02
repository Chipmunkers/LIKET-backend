import { NextFunction, Request, Response } from "express";
import ResponseResult from "../utils/ResponseResult";
import { verifyToken } from "../utils/token";
import { BadRequestException, ConflictException, InternalServerErrorException } from "../utils/Exception";
import validator from "../utils/validator";
import { emailRegExp, nameRegExp, onlyNumberRegExp, pwRegExp } from "../utils/regExp";
import prisma from "../utils/prisma";
import { hash } from "../utils/hash";

// 소셜 로그인 회원가입하기
export const socailLoginSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const { token, nickname, birthYear, } = req.body;
    const gender = Number(req.body.gender);
    const tokenData = verifyToken(token);

    const result = new ResponseResult();

    if (!validator(nickname).isString().testRegExp(nameRegExp).end())
        return next(new BadRequestException('닉네임 형식이 올바르지 않습니다.'));
    if (gender && !validator(gender).isNumber().includes([1, 2]).end())
        return next(new BadRequestException('성별 형식이 올바르지 않습니다.'));
    if (birthYear && !validator(birthYear).isString().length(4, 4).testRegExp(onlyNumberRegExp).end())
        return next(new BadRequestException('태어난 년도 형식이 올바르지 않습니다.'));
    if (tokenData === null)
        return next(new BadRequestException('소셜 로그인 토큰이 잘못되었습니다. 다시 시도해주세요.'));
    if (!tokenData.email)
        return next(new BadRequestException('토큰 데이터가 올바르지 않습니다.'));
    if (!tokenData.provider)
        return next(new BadRequestException('토큰 에러가 발생했습니다.'));

    try {

    } catch (err: any) {
        return next(new InternalServerErrorException('예상하지 못한 에러가 발생했습니다.', err));
    }

    res.status(result.status).send(result);
}

// 로컬 회원가입하기
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const gender = Number(req.body.gender) || null;
    const birthYear = req.body.birthYear;
    const profileImg = req.file?.filename || null;

    const result = new ResponseResult();

    if (!validator(email).isString().testRegExp(emailRegExp).end())
        return next(new BadRequestException('이메일 형식이 올바르지 않습니다.'));
    if (!validator(pw).isString().testRegExp(pwRegExp).end())
        return next(new BadRequestException('비밀번호 형식이 올바르지 않습니다.'));
    if (!validator(nickname).isString().testRegExp(nameRegExp).end())
        return next(new BadRequestException('닉네임 형식이 올바르지 않습니다.'));
    if (gender && !validator(gender).isNumber().includes([1, 2]).end())
        return next(new BadRequestException('성별 형식이 올바르지 않습니다.'));
    if (birthYear && !validator(birthYear).isString().length(4, 4).testRegExp(onlyNumberRegExp).end())
        return next(new BadRequestException('태어난 년도 형식이 올바르지 않습니다.'));

    try {
        const sameUser = await prisma.user.findFirst({
            where: {
                deletedAt: null,
                OR: [
                    {
                        email: email
                    },
                    {
                        nickname: nickname
                    }
                ]
            },
            select: {
                email: true,
                nickname: true
            }
        });

        if (sameUser && sameUser?.email === email)
            return next(new BadRequestException('이미 존재하는 이메일입니다.'));
        if (sameUser)
            return next(new ConflictException('이미 존재하는 닉네임입니다.'));

        await prisma.user.create({
            data: {
                email,
                nickname,
                pw: hash(pw),
                gender,
                birthYear: new Date(`${birthYear}-01-01T09:00`),
                profile: profileImg
            }
        });
    } catch (err) {
        return next(new InternalServerErrorException('예상하지 못한 에러가 발생했습니다.', err));
    }

    res.status(result.status).send(result);
}
