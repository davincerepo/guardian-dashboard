import APIClient from "src/framework/client/APIClient"
import { Result } from "src/framework/client/Result"
import { KLinesRequest, KLinesResponse } from "src/types/KLineTypes"

async function query(req: KLinesRequest): Promise<Result<KLinesResponse>> {
    const rsp = await APIClient.post('/klines/query', req)
    return rsp
}

export default {
    query
}