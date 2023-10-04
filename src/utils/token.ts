import jwt from 'jsonwebtoken';
import env from '../config/env';
import { TokenPayload } from '../types/TokenPayload';
import axios from 'axios';
import { SocialLoginProvider } from '../types/SocialLoginProvider';

export const createToken = (payload: TokenPayload, expiresIn = '24h'): string => {
    const issuer = '';

    return jwt.sign(
        payload,
        env.jwtSecretKey as string,
        {
            expiresIn,
            issuer
        }
    )
}

export const verifyToken = (token: string): jwt.JwtPayload | null => {
    try {
        const verifiedData = jwt.verify(token, env.jwtSecretKey as string);

        if (typeof verifiedData === 'string')
            return null;

        return verifiedData;
    } catch (err) {
        return null;
    }
}

export const verifyAccessToken = async (accessToken: string, provider: SocialLoginProvider): Promise<{ id: string, email: string } | null> => {
    try {
        if (provider === 'kakao') {
            const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const id = result.data.id.toString();
            const email = result.data.kakao_account.email;

            return { id, email };
        }

        if (provider === 'naver') {
            const result = await axios.get('https://openapi.naver.com/v1/nid/me	', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const id = result.data.response.id;
            const email = result.data.response.email;

            return { id, email };
        }

        return null;
    } catch (err: any) {
        return null;
    }
}

