import { Exception } from "./Exception";

export default class ResponseResult {
    message: string | null = null;
    status = 200;
    data: any | null = null;

    constructor(err?: any) {
        if (err instanceof Exception) {
            this.message = err.message;
            this.status = err.status || 500;
            return;
        }

        if (err) {
            this.message = '예상하지 못한 에러가 발생했습니다.';
            this.status = 500;
            return;
        }
    }
}
