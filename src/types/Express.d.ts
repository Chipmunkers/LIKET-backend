import Exception from "../exceptions/Exception";
import { TokenPayload } from "./TokenPayload";

declare global {
    namespace Express {
        interface Request {
            userIdx?: TokenPayload.userIdx,
            date: Date,
            err?: any,
            file: Express.MulterS3.File
        }
    }
}

export { }
