import React, { useEffect, useState } from "react"
import { init, dispose, Store, DataLoaderGetBarsParams, KLineData, FormatDateParams, Chart } from 'klinecharts'
import { KLineLevel, KLinesRequest, KLinesResponse, MarketType } from "src/types/KLineTypes"
import RandomUtils from "src/utils/RandomUtils"
import { Result } from "src/framework/client/Result"
import DateUtils from "src/utils/DateUtils"
import dayjs from "dayjs"

export interface KLineChartProps {
    symbol: string
    marketType: MarketType
    level: KLineLevel
    initTime: number // [startTime, endTime)
    loader: (req: KLinesRequest) => Promise<Result<KLinesResponse>>
    loadBatchSize?: number // 每次加载多少根
}

export const KLineChart: React.FC<KLineChartProps> = ({
    symbol,
    marketType,
    level,
    initTime,
    loader,
    loadBatchSize = 500
}) => {
    const [id,] = useState(() => RandomUtils.uuidStr())

    useEffect(() => {
        const chart: Chart = init(id) as any
        chart.setSymbol({ ticker: symbol } as any)
        chart.setPeriod({ span: level, type: 'second' })
        chart.setFormatter({
            formatDate: (params: FormatDateParams) => {
                if (level >= KLineLevel.LV_1D) {
                    return dayjs(params.timestamp).format("YYYY-MM-DD")
                } else {
                    return dayjs(params.timestamp).format("YYYY-MM-DD HH:mm:ss")
                }
            }
        })
        // chart.createIndicator('MA', false, { id: 'candle_pane' })
        // chart.overrideIndicator({
        //     name: 'MA',
        //     shouldOhlc: false,
        //     precision: 1,
        //     calcParams: [10, 30],
        //     styles: {
        //         lines: [
        //             { color: '#8fd3e8' },
        //             { color: '#edafda' }
        //         ]
        //     }
        // })
        // chart.createIndicator('VOL')
        chart.setDataLoader({
            getBars: async (params: DataLoaderGetBarsParams) => {
                console.log(`KLineChart: getBars: ${JSON.stringify(params)}`);

                let startTime = initTime - loadBatchSize * level * 1000
                let endTime = initTime + loadBatchSize * level * 1000
                if (params.type == 'forward') {
                    endTime = params.timestamp! + level * 1000
                    startTime = endTime - loadBatchSize * level * 1000
                } else if (params.type == 'backward') {
                    startTime = params.timestamp!
                    endTime = startTime + loadBatchSize * level * 1000
                }

                let res = await loader({
                    symbol: symbol,
                    marketType: marketType,
                    level: level,
                    startTime: startTime,
                    endTime: endTime,
                })
                if (!res.success) {
                    console.error(`KLineChart: load kline data failed: ${res.msg}`);
                    return
                }

                let klines: KLineData[] = []
                for (let kline of res.body.klines) {
                    klines.push({
                        timestamp: kline.openTime,
                        open: Number(kline.openPrice),
                        high: Number(kline.highPrice),
                        low: Number(kline.lowPrice),
                        close: Number(kline.closePrice),
                        volume: Number(kline.volume),
                    })
                }
                params.callback(klines, {
                    backward: true,
                    forward: true
                })
            }
        })

        return () => {
            dispose(id)
        }
    }, [])

    return <div id={id} style={{
        height: 450,
    }} />
}