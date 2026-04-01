import { DependencyList, useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

export interface UseAxiosEffectResult<T> {
    data: T;
    isLoading: boolean;
    error: Error | undefined;
}

export const useAxiosEffect = <T>(
    getData: (options: AxiosRequestConfig) => Promise<T>,
    deps: DependencyList,
    defaultState: T
): UseAxiosEffectResult<T> => {
    const [data, setData] = useState<T>(defaultState);
    const [error, setError] = useState<Error>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let unmounted = false;
        const controller = new AbortController();

        getData({
            signal: controller.signal,
        })
            .then((res) => {
                if (!unmounted) {
                    setLoading(false);
                    setData(res);
                }
            })
            .catch((e: Error) => {
                if (!unmounted) {
                    setLoading(false);
                    setError(e);
                }
            });

        return () => {
            unmounted = true;
            controller.abort();
        };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, isLoading, error };
};
