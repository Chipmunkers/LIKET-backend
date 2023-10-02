import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { BadRequestException, InternalServerErrorException } from "../utils/Exception";
import { uploadS3MulterConfig } from "../config/multer.config";

export const uploadProfileImg = (): express.RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        multer(uploadS3MulterConfig).single('img')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return next(new BadRequestException('업로드 도중 에러가 발생했습니다.'));
            }

            if (err) {
                return next(new InternalServerErrorException('예상하지 못한 에러가 발생했습니다.', err));
            }

            next();
        });
    }
}