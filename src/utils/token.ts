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

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, env.jwtSecretKey as string);
    } catch (err) {
        return null;
    }
}
