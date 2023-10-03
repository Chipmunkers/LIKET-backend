import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import passport from '../config/passport.config';

const authRouter = Router();

authRouter.get('/naver', passport.authenticate('naver'));
authRouter.get('/naver/callback', authController.naverLogin);

authRouter.get('/kakao', passport.authenticate('kakao'));
authRouter.get('/kakao/callback', authController.kakaoLogin);

authRouter.post('/number', authController.sendEmailAuthNumber);

export default authRouter;
