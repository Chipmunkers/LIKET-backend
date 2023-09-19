import ResponseResult from "../utils/ResponseResult";

export interface Log {
    ip: string | null,
    user: ToeknPayload | null,
    method: string,
    path: string,
    query: string | null,
    body: any,
    req_time: Date,
    res_time: Date,
    status: number,
    result: ResponseResult | string,
    err?: any
}
