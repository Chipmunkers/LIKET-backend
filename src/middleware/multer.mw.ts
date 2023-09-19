import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import env from "../config/env";
import { BadRequestException, ConflictException } from "../utils/Exception";
import * as random from '../utils/random';

const uploadS3 = multer({
    storage: multerS3({
        s3: new S3Client({
            region: env.awsRegion,
            credentials: {
                accessKeyId: env.awsAccessKyeId,
                secretAccessKey: env.awsSecretAccessKey
            }
        }),
        bucket: '버킷이름',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req: Request, file: Express.Multer.File, cb) => {
            const path = '/';
            const filename = '';

            cb(null, path + '/' + filename);
        }
    }),
    fileFilter(req: Request, file: Express.Multer.File, cb) {
        if (!(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')) {
            return cb(null, false);
        }

        cb(null, true);
    },
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB
    }
});

export const uploadImg = (): express.RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        uploadS3.single('img')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return next(new BadRequestException('업로드 도중 에러가 발생했습니다.'));
            }

            if (err) {
                return next(new ConflictException('예상하지 못한 에러가 발생했습니다.', err));
            }

            next();
        });
    }
}
