import multer from "multer";
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import env from "./env";
import { Request } from "express";
import * as random from '../utils/random';

export const uploadS3MulterConfig: multer.Options = {
    storage: multerS3({
        s3: new S3Client({
            region: env.awsRegion,
            credentials: {
                accessKeyId: env.awsAccessKyeId,
                secretAccessKey: env.awsSecretAccessKey
            }
        }),
        bucket: 'liket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req: Request, file: Express.Multer.File, cb) => {
            const path = 'user_profile';
            const filename = random.numberString(6) + '-' + new Date().getTime().toString() + '.png';

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
}