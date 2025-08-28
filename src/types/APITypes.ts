
export interface PageRequest {
    page: number //页数，从1开始
    pageSize: number
}

export interface PageResponse {
    total: number // 总记录数
    pages: number // 总页数
    current: number
}