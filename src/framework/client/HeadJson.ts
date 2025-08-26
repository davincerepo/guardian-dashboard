/**
 * 动态获取api服务器地址是必要的，方便维护迁移，可以区分多环境，更安全。
 * 首次请求获取一个静态json，而不是直接查询数据库，也是更灵活的。但要避免在headjson添加多余功能。
 */
export interface HeadJson {
    buildType: string // debug, release
    channel: string // 应用商店, 地区
    apiUrl: string
}