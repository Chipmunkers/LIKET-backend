import { NextFunction, Request, Response } from "express";
import { BadRequestException, Exception, InternalServerErrorException } from "../utils/Exception";
import cookieConfig from "../config/cookie.config";
import passport from "../config/passport.config";
import ResponseResult from "../utils/ResponseResult";
import validator from "../utils/validator";
import { emailRegExp, onlyNumberRegExp } from "../utils/regExp";
import redisClient from "../utils/redisClient";
import * as random from '../utils/random';
import { sendEmail } from "../utils/send";

// 로컬 로그인
export const login = async (req: Request, res: Response, next: NextFunction) => {
}

// 네이버 로그인
export const naverLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('naver', {
        failureRedirect: '/login?provider=naver',
        session: false
    }, async (err: any, data: any) => {
        if (err instanceof Exception) {
            return res.redirect(`/login/error?provider=naver&message=${err.message}`);
        }

        if (err) {
            return res.redirect('/login/error?provider=naver');
        }

        if (data.tokenType === 'login') {
            res.cookie('token', data.token, cookieConfig);
            res.redirect('/');
            return;
        }

        res.redirect(`/signup?token=${data.token}`);
    })(req, res, next);
}

// 카카오 로그인
export const kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('kakao', {
        failureRedirect: '/login?provider=kakao',
        session: false
    }, (err: any, data: { token: string, tokenType: 'signup' | 'login' }) => {
        if (err instanceof Exception) {
            return res.redirect(`/login/error?provider=naver&message=${err.message}`);
        }

        if (err) {
            return res.redirect('/login/error?provider=naver');
        }

        if (data.tokenType === 'login') {
            res.cookie('token', data.token, cookieConfig);
            res.redirect('/');
            return;
        }

        res.redirect(`/signup?token=${data.token}`);
    })(req, res, next);
}

// 인증번호 발송하기
export const sendEmailAuthNumber = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    const result = new ResponseResult();

    if (!validator(email).isString().testRegExp(emailRegExp).end())
        return next(new BadRequestException('이메일 형식이 올바르지 않습니다.'));

    try {
        const randomNumber = random.numberString(6);

        await redisClient.set(`email-auth-number-${email}`, randomNumber);
        await redisClient.expire(`email-auth-number-${email}`, 60 * 3);

        await sendEmail(email, 'LIKET: 인증번호', `<h1>${randomNumber}</h1>`);
    } catch (err) {
        return next(new InternalServerErrorException('예상하지 못한 에러가 발생했습니다.', err));
    }

    res.status(result.status).send(result);
}

// 인증번호 확인하기
export const checkEmailAuthNumber = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const inputAuthNumber = req.body.authNumber;

    const result = new ResponseResult();

    if (!validator(email).isString().testRegExp(emailRegExp).end())
        return next(new BadRequestException('이메일 형식이 올바르지 않습니다.'));
    if (!validator(inputAuthNumber).isString().length(6, 6).testRegExp(onlyNumberRegExp).end())
        return next(new BadRequestException('인증번호가 잘못되었습니다.'));

    try {
        const correctAuthNumber = await redisClient.get(`email-auth-number-${email}`);

        if (correctAuthNumber !== inputAuthNumber)
            return next(new BadRequestException('인증번호가 잘못되었습니다.'));

        await redisClient.set(`certified-email-${email}`, '1');
        await redisClient.expire(`certified-email-${email}`, 60 * 30);

        await redisClient.del(`email-auth-number-${email}`);
    } catch (err) {
        return next(new InternalServerErrorException('예상하지 못한 에러가 발생했습니다.', err));
    }

    res.status(result.status).send(result);
}
