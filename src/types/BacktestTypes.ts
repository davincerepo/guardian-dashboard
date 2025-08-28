import { Result } from "src/framework/client/Result"
import { PageRequest, PageResponse } from "src/types/APITypes";

export interface BacktestVO {
    id: string
    symbol: string
    marketType: number
    createTime: number
    paramsPackageId: string
    testRangeStartTime: number
    testRangeEndTime: number
}

export interface BacktestListRequest extends PageRequest {

}

export interface BacktestListResponse extends PageResponse {
    list: BacktestVO[]
}
