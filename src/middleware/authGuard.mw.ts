import express, { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";
import { UnauthorizedException } from "../utils/Exception";

export const loginAuthGaurd = (): express.RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //from FE
        const token = req.cookies.token;

        const decodedData = verifyToken(token);

        if (!decodedData) {
            return next(new UnauthorizedException('토큰이 없거나 만료되었습니다.'));
        }

        next();
    }
}
