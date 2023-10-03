import passport from 'passport';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import env from './env';
import prisma from '../utils/prisma';
import { SocialLoginProvider } from '../types/SocialLoginProvider';
import { ConflictException, InternalServerErrorException } from '../utils/Exception';
import { createToken } from '../utils/token';

const handleUserProfile = async (provider: SocialLoginProvider, info: { id: string, accessToken: string, email: string }, done: passport.DoneCallback) => {
    try {
        const user = await prisma.socialUser.findFirst({
            where: {
                user: {
                    deletedAt: null,
                    provider
                },
                snsId: info.id
            },
            select: {
                userIdx: true
            }
        });

        if (user)
            return done(null, { loginToken: createToken({ userIdx: user.userIdx, provider: provider }) });

        const sameUser = await prisma.user.findFirst({
            where: {
                deletedAt: null,
                email: info.email
            },
            select: {
                userIdx: true,
                email: true,
                nickname: true
            }
        });

        if (sameUser)
            done(new ConflictException('이미 가입된 이메일입니다.'));


        done(null, { accessToken: info.accessToken });
    } catch (err) {
        done(new InternalServerErrorException('예상하지 못한 에러가 발생했습니다.', err));
    }
}

passport.use(new NaverStrategy({
    clientID: env.naverClientId,
    clientSecret: env.naverClientSecret,
    callbackURL: '/auth/naver/callback'
}, async (accessToken: string, refreshToken: string, profile: NaverProfile, done: passport.DoneCallback) => {
    const id = profile.id;
    const email = profile.email || '';

    handleUserProfile('naver', { id, accessToken, email }, done);
}));

passport.use(new KakaoStrategy({
    clientID: env.kakaoClientId,
    clientSecret: env.kakaoClientSecret,
    callbackURL: '/auth/kakao/callback'
}, async (accessToken: string, refreshToken: string, profile: any, done: passport.DoneCallback) => {
    const id = profile.id.toString();
    const email = profile._json.kakao_account.email;

    handleUserProfile('kakao', { id, accessToken, email }, done);
}));

export default passport;
