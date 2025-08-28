import { useCallback, useEffect, useState } from "react";
import { Result } from "src/framework/client/Result";

export function useApiRequest<T>(fun: () => Promise<Result<T>>): {
    data: T, // errorCode == 0 再读取data
    errorCode: number, // loading 为false再读取errorCode
    loading: boolean
} {
    const [data, setData] = useState<T | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        (async () => {
            try {
                const res = await fun();
                setErrorCode(res.code)
                if (res.success) {
                    setData(res.body)
                }
            } finally {
                setLoading(false);
            }
        })();
        
    }, [fun]);

    return {
        data: data as any,
        errorCode: errorCode as any,
        loading
    };
}
