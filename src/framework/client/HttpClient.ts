
export interface HttpResult {
    success: boolean
    httpStatus?: number
    body?: string
}

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit & { timeout?: number }): Promise<Response> {
    const { timeout, ...options } = init || {};
    const controller = new AbortController();
    const originalSignal = options.signal;

    // 合并原有的signal
    if (originalSignal) {
        if (originalSignal.aborted) {
            controller.abort();
        } else {
            const abortHandler = () => controller.abort();
            originalSignal.addEventListener('abort', abortHandler);
        }
    }

    let timeoutId: NodeJS.Timeout | undefined;
    if (timeout) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
    }

    try {
        const response = await fetch(input, {
            ...options,
            signal: controller.signal,
        });

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        return response;
    } catch (error) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        throw error;
    }
}


export default {
    fetchWithTimeout,
}
