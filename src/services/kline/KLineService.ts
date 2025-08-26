import APIClient from "src/framework/client/APIClient"
import { Result } from "src/framework/client/Result"

async function hello(name: string): Promise<Result<string>> {
    const rsp = await APIClient.get('/hello', {
    })
    return rsp
}

export default {
    hello
}