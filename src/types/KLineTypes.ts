import { Result } from "src/framework/client/Result"

export enum MarketType {
    BINANCE_FUTURE = 1,
    BINANCE_SPOT = 2,
    OKX_FUTURE = 3,
    OKX_SPOT = 4,
}

export const MarketTypeMap: Record<MarketType, { name: string;  }> = {
    [MarketType.BINANCE_FUTURE]: { name: "币安合约",  },
    [MarketType.BINANCE_SPOT]: { name: "币安现货",  },
    [MarketType.OKX_FUTURE]: { name: "OKX合约",  },
    [MarketType.OKX_SPOT]: { name: "OKX现货",  },
};

export enum KLineLevel {
    LV_1S = 1,
    LV_1MIN = 60,
    LV_5MIN = 300,
    LV_15MIN = 900,
    LV_1H = 3600,
    LV_4H = 14400,
    LV_12H = 43200,
    LV_1D = 86400,
    LV_1W = 604800,
    LV_1MON = 2592000,
    LV_4MON = 10368000,
    LV_1Y = 31536000,
    LV_10Y = 315360000,
}

export enum KLineCloseType {
    NOT_CLOSED = 0, // 未闭合
    CONFIRM_CLOSED = 1, // 已确认闭合，该k线后面有新的k线了
    CLOSED_BY_SERVER_TIME = 2, // 根据服务器时间判断，该k线已闭合
    CLOSED_BY_LOCAL_TIME = 3, // 根据本地时间判断，该k线已闭合
}


export interface ExchangeKLine {
    symbol: string
    marketType: MarketType

    openTime: number // 开盘时间，[openTime, closeTime)
    closeTime: number // 收盘时间，下根k线的开盘时间，[openTime, closeTime)
    openPrice: string // 开盘价
    closePrice: string // 收盘价
    highPrice: string // 最高价
    lowPrice: string // 最低价
    volume: string // 成交量
    quoteAssetVolume: string // 成交额
    tradeNum: number // 成交笔数
    takerBuyVolume: string
    takerBuyQuoteAssetVolume: string // Taker买入成交额

    level: KLineLevel // K线级别枚举
    firstTime: number // k线内最早数据，k线闭合后等于openTime。[firstTime, lastTime)
    lastTime: number // k线内最晚数据，k线闭合后等于closeTime

    responseTime: number
    closeType: KLineCloseType
}


export interface KLinesRequest {
    symbol: string
    marketType: MarketType
    level: KLineLevel
    startTime: number // [startTime, endTime)
    endTime: number
}

export interface KLinesResponse {
    klines: ExchangeKLine[]
}

