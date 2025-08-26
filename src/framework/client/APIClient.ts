import _ from "lodash"
import HttpClient from "src/framework/client/HttpClient"
import { Result } from "src/framework/client/Result"
import commonToast from "src/framework/react/CommonToast"
import { ErrorCode } from "src/framework/client/ErrorCode"
import RandomUtils from "src/utils/RandomUtils"
import { SettingKey, webSetting } from "src/framework/config/WebSetting"
import FileUtils from "src/utils/FileUtils"

/**
 * 专门用于连接APP后端服务器的client
 */

function internalErrResult(): Result<any> {
    return Result.errorCode(ErrorCode.TS_INTERNAL_ERROR)
}

function httpErrResult(status: number): Result<any> {
    return Result.errorCode(ErrorCode.TS_HTTP_ERROR)
}

function feedbackErrorCode(res: Result<any>) {
    var msg = '网络异常，请稍后再试。'
    switch (res.code) {
        case ErrorCode.SERVER_COMMON_USER_NOT_LOGIN:
        case ErrorCode.SERVER_COMMON_LOGIN_INVALID:
            {
                const userVO = webSetting.get(SettingKey.USER_VO)
                if (_.isEmpty(userVO)) {
                    msg = '请登录后操作'
                } else {
                    msg = '登录已失效，请重新登录'
                    commonToast.show(msg)
                    return
                }
                break
            }
        case ErrorCode.TS_INTERNAL_ERROR: {
            break
        }
        case ErrorCode.APP_SERVER_VERIFY_CODE_NON: {
            msg = '验证码不存在或已过期'
            break
        }
        case ErrorCode.APP_SERVER_VERIFY_CODE_WRONG: {
            msg = '验证码错误'
            break
        }
        case ErrorCode.APP_SERVER_ALREADY_VIP_FOREVER: {
            msg = '您已经是永久会员，无法继续购买'
            break
        }
    }
    commonToast.show(msg)
}

function apiHeaders(): Record<string, string> {
    return {
        'api-request-id': RandomUtils.uuidStr(),
    }
}

async function checkJSONRsp(rsp: Response, url: string): Promise<Result<any>> {
    if (!rsp.ok) {
        console.log(`HTTP error! status: ${rsp.status}, url ${url}`);
        return httpErrResult(rsp.status)
    }
    try {
        const json = await rsp.json()
        // console.log(`check rsp json ${json}, code ${json.code}, jstr ${JSON.stringify(json)}`);

        var res = new Result()
        res.body = json.body
        res.code = json.code == null ? -1 : json.code
        res.msg = json.msg
        return res
    } catch (err) {
        console.log(`JSON parse error! url ${url}, err ${err}`);
        return internalErrResult()
    }
}

/**
 * @param checkBisCode bisCode不为0是否抛出异常
 */
async function get(path: string, params: Record<string, string>, timeoutMs?: number): Promise<Result<any>> {
    const url = FileUtils.concatPath(webSetting.get(SettingKey.CLIENT_DATA_API_URL), path)
    console.log('http get url', url);
    const query = new URLSearchParams(params)

    try {
        const rsp = await HttpClient.fetchWithTimeout(`${url}?${query}`, {
            headers: apiHeaders(),
            timeout: timeoutMs || webSetting.getNumber(SettingKey.CLIENT_HTTP_TIMEOUT)
        })
        // console.log('get rsp', rsp);

        return await checkJSONRsp(rsp, url) as any
    } catch (err) {
        console.log('fetch err', err);
        return internalErrResult()
    }

}

async function post(path: string, params: Record<string, any>, timeoutMs?: number): Promise<Result<any>> {
    const url = FileUtils.concatPath(webSetting.get(SettingKey.CLIENT_DATA_API_URL), path)

    console.log('http post url', url);
    try {
        const rsp = await HttpClient.fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...apiHeaders(),
            },
            body: JSON.stringify(params),
            timeout: timeoutMs || webSetting.getNumber(SettingKey.CLIENT_HTTP_TIMEOUT)
        })
        return await checkJSONRsp(rsp, url) as any
    } catch (err) {
        console.log('fetch err', err);
        return internalErrResult()
    }
}

export default {
    get,
    post,
    feedbackErrorCode,
}
