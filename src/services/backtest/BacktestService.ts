import APIClient from "src/framework/client/APIClient"
import { Result } from "src/framework/client/Result"
import { BacktestListRequest, BacktestListResponse } from "src/types/BacktestTypes"

async function list(req: BacktestListRequest): Promise<Result<BacktestListResponse>> {
    const rsp = await APIClient.post('/backtest/list', req)
    return rsp
}

export default {
    list
}