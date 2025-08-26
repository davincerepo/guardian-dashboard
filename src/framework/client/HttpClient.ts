import * as FileSystem from 'expo-file-system'
import appConfig from "src/framework/common/AppConfig"
import NativeUtils from 'src/framework/native/NativeUtils'

export interface HttpResult {
    success: boolean
    httpStatus?: number
    body?: string
}

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit & { timeout?: number }): Promise<Response> {
    const { timeout, ...options } = init || {};
    const controller = new AbortController();
    const originalSignal = options.signal;

    // 合并原有的signal
    if (originalSignal) {
        if (originalSignal.aborted) {
            controller.abort();
        } else {
            const abortHandler = () => controller.abort();
            originalSignal.addEventListener('abort', abortHandler);
        }
    }

    let timeoutId: NodeJS.Timeout | undefined;
    if (timeout) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
    }

    try {
        const response = await fetch(input, {
            ...options,
            signal: controller.signal,
        });

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        return response;
    } catch (error) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        throw error;
    }
}

async function upload(url: string, 
    fileUri: string,
    fileParamName: string = 'file',
    formParams: Record<string, string> = {}): Promise<HttpResult> {

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists || fileInfo.isDirectory) {
        console.log(`file not exists: ${fileUri}`);
        return {
            success: false
        }
    }

    console.log(`http upload url ${NativeUtils.isDebug() ? url : '***'}, file ${fileUri}, size ${fileInfo.size}`);
    const mimeType = 'application/octet-stream'
    const formData = new FormData();
    formData.append(fileParamName, {
        uri: fileUri,
        type: mimeType,
        name: 'test.'
    });

    for (const key in formParams) {
        formData.append(key, formParams[key]);
    }

    try {
        const rsp = await fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
            },
            body: formData,
            timeout: appConfig.getClient_uploadTimeout()
        })
        console.log(`ok ${rsp.ok}, status ${rsp.status}`);
        if (!rsp.ok) {
            return {
                success: false,
                httpStatus: rsp.status
            }
        }
        return {
            success: true,
            httpStatus: rsp.status,
            body: await rsp.text()
        }
    } catch (err) {
        console.log('fetch err', err);
        return {
            success: false
        }
    }
}

export default {
    fetchWithTimeout,
    upload,
}
