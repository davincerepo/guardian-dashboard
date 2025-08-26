import { ErrorCode } from "src/framework/client/ErrorCode"

export class Result<T> {
    code: number = 0 // 异常码，0表示成功
    msg?: string
    body!: T

    get success(): boolean {
        return this.code === 0
    }

    static success<T>(body: T): Result<T> {
        var res = new Result<T>()
        res.code = 0
        res.body = body
        return res
    }

    static error<T>(code: number, msg: string = ''): Result<T> {
        var res = new Result<T>()
        res.code = code
        res.msg = msg
        return res
    }

    static errorCode<T>(code: ErrorCode): Result<T> {
        return this.error<T>(code, ErrorCode[code])
    }

    static parse<T>(data: string): Result<T> {
        try {
            const json = JSON.parse(data)
            var res = new Result()
            res.code = json.code == null ? - 1 : json.code
            res.msg = json.msg
            res.body = json.body
            return res as any
        } catch (error) {
            console.error('Result parse error:', error)
            return this.error<T>(ErrorCode.TS_PARSER_JSON_ERR)
        }
    }
}
