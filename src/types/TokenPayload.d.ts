import * as jwt from 'jsonwebtoken';

export type TokenPayload = {
    email: string,
    provider: 'local' | 'naver' | 'kakao' | 'apple'
}

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        userIdx: number,
        provider: 'local' | 'naver' | 'kakao' | 'apple'
    }
}
