import { NextFunction, Request, Response } from "express";
import { Exception } from "../utils/Exception";
import cookieConfig from "../config/cookie.config";
import passport from "../config/passport.config";

export const login = async (req: Request, res: Response, next: NextFunction) => {
}

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

