import { message } from 'antd';

export enum ToastLevel {
    SUCCESS,
    INFO,
    ERROR,
    WARN,
    LOADING
}

export interface ToastOptions {
    durationMs?: number
    level?: ToastLevel
}

export class CommonToast {

    show = (msg: string, options: ToastOptions = {}) => {
        const { durationMs = 2000, level = ToastLevel.INFO } = options

        if (level == ToastLevel.SUCCESS) {
            message.success(msg, durationMs)
        } else if (level == ToastLevel.ERROR) {
            message.error(msg, durationMs)
        } else if (level == ToastLevel.WARN) {
            message.warning(msg, durationMs)
        } else if (level == ToastLevel.INFO) {
            message.info(msg, durationMs)
        } else if (level == ToastLevel.LOADING) {
            message.loading(msg, durationMs)
        }
    }

}

const commonToast = new CommonToast()
export default commonToast