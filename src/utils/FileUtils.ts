import _ from 'lodash';

export const extractFolderName = (path: string | null | undefined) => {
    if (path == null) {
        return ''
    }
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1)
    }
    let index = path.lastIndexOf('/')
    if (index == -1) {
        return path
    }
    return path.substring(index + 1)
}

export const extractParentPath = (path: string) => {
    let index = path.lastIndexOf('/')
    if (index == -1) {
        return ''
    }
    return path.substring(0, index)
}

export function isBarePath(s: string) {
    return s.includes('://')
}

export function toFileUri(s: string | null | undefined) {
    if (s == null) {
        return ''
    }
    if (s.startsWith("file://")) {
        return s
    }
    try {
        var url = new URL("file://" + s)
        return url + ''
    } catch (error) {
        console.log('toFileUri error', s, error);
        return ''
    }
}

export function fromFileUri(s: string) {
    try {
        if (s.includes("://")) {
            const url = new URL(s)
            if (!_.isEmpty(url.hostname)) {
                return decodeURIComponent(url.hostname)
            }
            if (!_.isEmpty(url.pathname)) {
                return decodeURIComponent(url.pathname)
            }
            return ''
        } else {
            return s
        }
    } catch (error) {
        console.log('fromFileUri error', s, error);
        return ''
    }
}

export function extractFileExt(path: string): string {
    // 替换 Windows 和 Unix 路径分隔符，提取最后的文件名部分
    const filename = path.split(/[/\\]/).pop()
    if (!filename) return ''
    
    const index = filename.lastIndexOf('.')
    if (index <= 0) {
        // 没有扩展名，或是以点开头的隐藏文件（如 .gitignore）
        return ''
    }
    return filename.substring(index + 1)
}

export function removeFileExt(path: string) {
    let index = path.lastIndexOf('.')
    if (index == -1) {
        return path
    }
    return path.substring(0, index)
}

function concatPath(headPart: string, ...parts: (string | null | undefined)[]): string {
    if (_.isEmpty(headPart)) {
        // hearPart为空，后面拼接的时候开头加不加/？不确定，所以不能为空
        throw new Error('headPart cannot be empty')
    }

    let res = headPart
    
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i]
        if (_.isEmpty(part)) {
            continue
        }
        res = _.trimEnd(res, '/\\') + '/' + _.trimStart(part!, '/\\')
    }
    return res
}

export default {
    extractFolderName,
    extractParentPath,
    isBarePath,
    toFileUri,
    fromFileUri,
    extractFileExt,
    removeFileExt,
    concatPath,
}
