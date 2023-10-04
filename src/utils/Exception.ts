export class Exception {
    error: any; // 에러 객체를 담는 변수
    err: string; // 상태코드 에러 이름을 담는 문자열 변수
    message: string | null; // 프론트로 보낼 에러 메세지
    status: number;

    constructor(err: string, status: number, message: string | null, error: any) {
        this.error = error;
        this.message = message;
        this.err = err;
        this.status = status;
    }
}

export class BadRequestException extends Exception {
    status = 400;

    constructor(message: string, error?: any) {
        super('Bad Request', 400, message, error);
    }
}

export class UnauthorizedException extends Exception {
    status = 401;

    constructor(message: string, error?: any) {
        super('Unauthorized', 401, message, error);
    }
}

export class ForbiddenException extends Exception {
    status = 403;

    constructor(message: string, error?: any) {
        super('Forbidden', 403, message, error);
    }
}

export class NotFoundException extends Exception {
    status = 404;

    constructor(message: string, error?: any) {
        super('Not Found', 404, message, error);
    }
}

export class ConflictException extends Exception {
    status = 409;

    constructor(message: string, error?: any) {
        super('Conflict', 409, message, error);
    }
}

export class InternalServerErrorException extends Exception {
    status = 500;

    constructor(message: string, error?: any) {
        super('Internal Server Error', 500, message, error);
    }
}
