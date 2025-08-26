import _ from "lodash";
import { makeAutoObservable } from "mobx";
import { SettingKey, webSetting } from "src/framework/config/WebSetting";
import { UserVO } from "src/types/user";

/**
 * 放全局变量
 */
export class AppStore {

    constructor() {
        makeAutoObservable(this)
    }

    get userVO() {
        let vos = webSetting.get(SettingKey.USER_VO)
        if (!_.isEmpty(vos)) {
            return JSON.parse(vos)
        } else {
            return null
        }
    }

    setUserVO(userVO: UserVO | null) {
        webSetting.set(SettingKey.USER_VO, JSON.stringify(userVO))
    }
}

export const appStore = new AppStore()