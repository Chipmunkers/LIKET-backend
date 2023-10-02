import jwt from 'jsonwebtoken';
import env from '../config/env';
import { TokenPayload } from '../types/TokenPayload';

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
