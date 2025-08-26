import _ from "lodash"
import HttpClient from "src/framework/client/HttpClient"
import { Result } from "src/framework/client/Result"
import commonToast from "src/framework/react/CommonToast"
import NavigationHelper from "src/framework/react/NavigationHelper"
import FileUtils from "src/utils/FileUtils"
import RandomUtils from "src/utils/RandomUtils"
import { HeadJson } from "./HeadJson"
import { ErrorCode } from "src/framework/client/ErrorCode"

/**
 * 专门用于连接APP后端服务器的client
 */

var headJson: HeadJson | null = null

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
                const userVO = appConfig.getUser_userVO()
                if (userVO == null) {
                    msg = '请登录后操作'
                } else {
                    msg = '登录已失效，请重新登录'
                    appConfig.setUser_userVO(null)
                    commonToast.showCommon(msg)
                    const navi = NavigationHelper.getNavigation()
                    navi?.navigate('LoginScreen')
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
    commonToast.showCommon(msg)
}

async function getHeadJson(): Promise<HeadJson | null> {
    if (headJson != null) {
        return headJson
    }
    const buildInfo = NativeUtils.getBuildInfo()
    const url = appConfig.getClient_headJsonUrl()
    const timeout = appConfig.getClient_httpTimeout()
    console.log(`http get headJson url ${url}, package ${buildInfo.packageName}, buildType ${buildInfo.buildType}, timeoutMs ${timeout}`);
    try {
        const rsp = await HttpClient.fetchWithTimeout(url, {
            timeout: timeout
        })

        if (!rsp.ok) {
            console.log(`http get headJson failed, status ${rsp.status}`);
            return null
        }

        var val: HeadJson[] = await rsp.json()
        if (val != null) {
            for (const item of val) {
                if (item.buildType == buildInfo.buildType && item.channel == buildInfo.channel) {
                    headJson = item
                }
            }
            if (headJson == null) {
                for (const item of val) {
                    if (item.buildType == buildInfo.buildType && item.channel == 'default') {
                        headJson = item
                    }
                }
            }
        }
        console.log(`get headJson success: ${JSON.stringify(headJson)}, buildInfo ${JSON.stringify(buildInfo)}`);
        return headJson
    } catch (err) {
        console.log('get headJson err', err);
        return null
    }

}

function apiHeaders(headJson: HeadJson): Record<string, string> {
    const userVO = appConfig.getUser_userVO()

    return {
        'api-login-token': userVO?.loginToken || '',
        'api-user-id': userVO?.userId || '',
        'api-install-id': appConfig.getApp_installId(),
        'api-request-id': RandomUtils.uuidStr(),
        'api-app-version-name': NativeUtils.getBuildInfo().versionName,
        'api-app-version-code': NativeUtils.getBuildInfo().versionCode + '',
        'api-build-type': NativeUtils.getBuildType(),
        'api-channel': NativeUtils.getBuildInfo().channel,
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
    const headJson = await getHeadJson()
    if (headJson == null) {
        console.log('headJson is null');
        return internalErrResult()
    }
    const url = headJson.apiUrl + path
    console.log('http get url', url);
    const query = new URLSearchParams(params)

    try {
        const rsp = await HttpClient.fetchWithTimeout(`${url}?${query}`, {
            headers: apiHeaders(headJson),
            timeout: timeoutMs || appConfig.getClient_httpTimeout()
        })
        // console.log('get rsp', rsp);

        return await checkJSONRsp(rsp, url) as any
    } catch (err) {
        console.log('fetch err', err);
        return internalErrResult()
    }

}

async function post(path: string, params: Record<string, any>, timeoutMs?: number): Promise<Result<any>> {
    const headJson = await getHeadJson()
    if (headJson == null) {
        console.log('headJson is null');
        return internalErrResult()
    }

    const url = headJson.apiUrl + path
    console.log('http post url', url);
    try {
        const rsp = await HttpClient.fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...apiHeaders(headJson),
            },
            body: JSON.stringify(params),
            timeout: timeoutMs || appConfig.getClient_httpTimeout()
        })
        return await checkJSONRsp(rsp, url) as any
    } catch (err) {
        console.log('fetch err', err);
        return internalErrResult()
    }
}

/**
 * @param params 普通参数
 * @param fileUris 文件参数，<参数名, uri>
 */
async function upload(apiPath: string, 
    params: Record<string, string>,
    fileUris: Record<string, string>): Promise<Result<any>> {
    const headJson = await getHeadJson()
    if (headJson == null) {
        console.log('headJson is null');
        return internalErrResult()
    }

    const url = headJson.apiUrl + apiPath
    console.log(`http upload url ${url}, files ${fileUris}`);

    const formData = new FormData();
    // 添加普通字段参数
    for (const [key, value] of Object.entries(params)) {
        formData.append(key, value);
    }

    // 添加文件参数
    for (const [fieldName, fileUri] of Object.entries(fileUris)) {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists || fileInfo.isDirectory) {
            console.log(`file not exists: ${fileUri}`);
            return internalErrResult();
        }

        let ext = FileUtils.extractFileExt(fileUri)
        if (!_.isEmpty(ext)) {
            ext = '.' + ext
        }
        console.log(`adding file field ${fieldName}, uri: ${fileUri}, size: ${fileInfo.size}, ext ${ext}`);

        formData.append(fieldName, {
            uri: fileUri,
            type: 'application/octet-stream',
            name: fieldName + ext
        } as any);
    }

    try {
        const rsp = await HttpClient.fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data', // 不要手动设置，让系统自动处理边界
                ...apiHeaders(headJson),
            },
            body: formData,
            timeout: appConfig.getClient_uploadTimeout()
        })
        console.log('ok');
        return await checkJSONRsp(rsp, url) as any
    } catch (err) {
        console.log('fetch err', err);
        return internalErrResult()
    }
}

export default {
    getHeadJson,
    get,
    post,
    upload,
    feedbackErrorCode,
}
