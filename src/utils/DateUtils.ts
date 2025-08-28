import dayjs from "dayjs";

const dayInMillis = 24 * 60 * 60 * 1000; 

function isSameDay(timestamp1, timestamp2) {
    return Math.floor(timestamp1 / dayInMillis) === Math.floor(timestamp2 / dayInMillis);
}

function prettyDate(timestamp:number):string {
    const now = new Date();
    const date = new Date(timestamp);
    
    const isSameYear = now.getFullYear() === date.getFullYear();
    
    // 获取当前日期和目标日期的年月日部分
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // 判断是否是今天
    if (date.toDateString() === today.toDateString()) {
        return '今天';
    }
    // 判断是否是昨天
    if (date.toDateString() === yesterday.toDateString()) {
        return '昨天';
    }

    // 格式化 MM-dd 或 yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (isSameYear) {
        return `${month}-${day}`;  // 同一年用 MM-dd
    } else {
        return `${year}-${month}-${day}`;  // 不同年用 yyyy-MM-dd
    }
}

function format1(timeMs: number) {
    return dayjs(timeMs).format('YYYY-MM-DD HH:mm:ss')
}

export default {
    prettyDate,
    isSameDay,
    format1
}