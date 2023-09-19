import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export default {
    //server port
    httpPort: Number(process.env.HTTP_PORT),
    httpsPort: Number(process.env.HTTPS_PORT),

    //server domain
    domain: process.env.DOMAIN || null,

    //psql
    psqlUser: process.env.PSQL_USER,
    psqlHost: process.env.PSQL_HOST,
    psqlDatabase: process.env.PSQL_DATABASE,
    psqlPassword: process.env.PSQL_PASSWORD,
    psqlPort: Number(process.env.PSQL_PORT),

    //Mongo DB
    mongoUser: process.env.MONGO_USER,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoHost: process.env.MONGO_HOST || 'localhost',
    mongoPort: process.env.MONGO_PORT || '27017',
    mongoDatabase: process.env.MONGO_DATABASE,

    //Root Directory
    rootDirectory: path.join(__dirname, '..', '..'),

    //jwt
    jwtSecretKey: process.env.JWT_SECRET_KEY,

    //aws
    awsAccessKyeId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsRegion: process.env.AWS_REGION || '',

    //password
    passwordSecret: process.env.PASSWORD_SECRET,

    //session
    sessionSecret: process.env.SESSION_SECRET,

    //gmail
    gmailUser: process.env.GMAIL_USER,
    gmailPassword: process.env.GMAIL_PASSWORD,

    //apple
    appleClientId: process.env.APPLE_CLIENT_ID,
    appleClientSecret: process.env.APPLE_CLIENT_SECRET,

    //kakao
    kakaoClientId: process.env.KAKAO_CLIENT_ID,
    kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET,

    //naver
    naverClientId: process.env.NAVER_CLIENT_ID,
    naverClientSecret: process.env.NAVER_CLIENT_SECRET
};
