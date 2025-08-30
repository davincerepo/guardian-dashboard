import APIClient from "src/framework/client/APIClient"
import { Result } from "src/framework/client/Result"
import { BacktestListRequest, BacktestListResponse, BacktestReport } from "src/types/BacktestTypes"

async function list(req: BacktestListRequest): Promise<Result<BacktestListResponse>> {
    const rsp = await APIClient.post('/backtest/list', req)
    return rsp
}

async function getReport(id: string): Promise<Result<BacktestReport>> {
    const rsp = await APIClient.get('/backtest/getReport', {
        id: id
    })
    return rsp
}

export default {
    list,
    getReport
}