import { PageRequest, PageResponse } from "src/types/APITypes";

export interface BacktestVO {
    id: string
    symbol: string
    marketType: number
    createTime: number
    paramsPackageId: string
    reportStartTime: number
    reportEndTime: number
}

export interface BacktestListRequest extends PageRequest {

}

export interface BacktestListResponse extends PageResponse {
    list: BacktestVO[]
}

export interface PositionRecordVO {
    id: string
    backtestId: string
    openLong: boolean
    openPrice: number
    closePrice: number
    remainFund: number // 平仓后资金
    openTime: number
    closeTime: number
    volume: number // 标的持仓量
    quotaAssetVolume: number // 持仓额
    profit: number // 盈亏
    profitRate: number // 收益率
}

export interface RevenueSummary {
    reportStartTime: number;
    reportEndTime: number;
    profitRate: number;
    winRate: number;
    profit: number;
    loss: number;
    maxPullback: number;
    sharpeRatio: number;
    plr: number
}

export interface BacktestReport {
    id: string
    symbol: string
    marketType: number
    createTime: number
    paramsPackageId: string
    reportStartTime: number
    reportEndTime: number
    positionRecords: PositionRecordVO[]
    revenueSummary: RevenueSummary
}
