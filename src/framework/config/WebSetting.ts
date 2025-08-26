import _ from "lodash";
import { makeAutoObservable, observable, runInAction } from "mobx";

export interface SettingItem {
    key: SettingKey
    type: "boolean" | "string" | "number";
    value: any
}

export enum SettingKey {
    /** client */
    CLIENT_DATA_API_URL = "client.dataApiUrl",
    CLIENT_HTTP_TIMEOUT = "client.httpTimeout",
    CLIENT_HTTP_TASK_WAIT_TIMEOUT = "client.httpTaskWaitTimeout",
    CLIENT_UPLOAD_TIMEOUT = "client.uploadTimeout",

    /** user */
    USER_VO = "user.userVO",
}

/**
 * 写死的配置，不支持动态修改
 */
const constProperties = {
    [SettingKey.CLIENT_DATA_API_URL]: import.meta.env.VITE_CLIENT_DATA_API_URL,
    [SettingKey.CLIENT_HTTP_TIMEOUT]: "10000",
    [SettingKey.CLIENT_HTTP_TASK_WAIT_TIMEOUT]: "20000",
    [SettingKey.CLIENT_UPLOAD_TIMEOUT]: "30000",
};

// 可以动态改变的配置或变量
export const settingItems: SettingItem[] = [
    {
        key: SettingKey.USER_VO,
        type: "string",
        value: '',
    },
]

class WebSetting {
    items: Map<string, string> = observable.map();

    constructor() {
        makeAutoObservable(this)
    }

    loadAll() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("WebSetting.")) {
                let val = localStorage.getItem(key)
                if (val) {
                    this.items.set(key, val)
                }
            }
        }
    }

    set(key: SettingKey, v: string) {
        if (key in constProperties) {
            throw new Error()
        }
        localStorage.setItem(key, v + '')
        this.items.set(key, v + '')
    }

    get(key: SettingKey): string {
        if (key in constProperties) {
            return constProperties[key]
        }
        return this.items.get(key) || ''
    }

    getBool(key: SettingKey) {
        return this.get(key) === 'true'
    }

    getJSONArray(key: SettingKey) {
        return JSON.parse(this.get(key) as string) || []
    }

    getNumber(key: SettingKey) {
        return parseFloat(this.items.get(key) || "0")
    }

}

export const webSetting = new WebSetting()