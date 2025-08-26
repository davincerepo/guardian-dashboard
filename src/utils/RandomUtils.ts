
export function randomStringId() {
    return (new Date().getTime().toString() + Math.random().toString()).replace('.', '')
}

export function randomNumId() {
    return Math.random() + new Date().getTime()
}

function randomDate(): Date {
    const today = new Date(); // 获取当前日期
    const randomDays = Math.floor(Math.random() * 1000) + 1; // 随机生成 1 到 1000 之间的数字
    today.setDate(today.getDate() - randomDays); // 将日期减去随机天数
    return today; // 返回新的日期
}

function uuidStr() {
    return crypto.randomUUID()
}

export default {
    randomStringId,
    randomNumId,
    uuidStr,
    randomDate
}