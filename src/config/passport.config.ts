import passport from 'passport';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import env from './env';
import { BadRequestException, ConflictException } from '../utils/Exception';
import { createToken } from '../utils/token';
import { SocialLoginData } from '../types/SocailLoginData';
import prisma from '../utils/prisma';

const handleUserProfile = async (provider: 'local' | 'naver' | 'kakao' | 'apple', loginData: SocialLoginData, done: passport.DoneCallback) => {
    if (!loginData) {
        return done(new BadRequestException('필수 동의 사항이 동의되지 않았습니다.'));
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: loginData.email
            },
            select: {
                userIdx: true,
                provider: true
            }
        });

        if (user?.provider && user?.provider !== provider) {
            return done(new BadRequestException(`이미 ${provider}로 회원가입한 계정입니다`));
        }

        let token = null;
        let tokenType = null;
        if (!user) {
            token = createToken({
                email: loginData.email,
                provider: provider
            });

            tokenType = 'signup';
        }

        if (user) {
            tokenType = 'login';
        }

        done(null, { token, tokenType });
    } catch (err: any) {
        return done(new ConflictException('예상하지 못한 에러가 발생했습니다.', err));
    }
}

passport.use(new NaverStrategy({
    clientID: env.naverClientId,
    clientSecret: env.naverClientSecret,
    callbackURL: '/auth/naver/callback'
}, async (accessToken: string, refreshToken: string, profile: NaverProfile, done: passport.DoneCallback) => {
    if (!profile.email) {
        return done(new BadRequestException('필수 동의항목이 동의되지 않았습니다.'));
    }

    handleUserProfile('naver', { email: profile.email }, done);
}));

passport.use(new KakaoStrategy({
    clientID: env.kakaoClientId,
    clientSecret: env.kakaoClientSecret,
    callbackURL: '/auth/kakao/callback'
}, async (accessToken: string, refreshToken: string, profile: any, done: passport.DoneCallback) => {
    if (!profile._json.kakao_account.email) {
        return done(new BadRequestException('필수 동의 항목이 동의되지 않았습니다.'));
    }

    handleUserProfile('kakao', { email: profile._json.kakao_account.email }, done);
}));

export default passport;
