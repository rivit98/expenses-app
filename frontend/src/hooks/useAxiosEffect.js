import { useEffect, useState } from 'react';

export const useAxiosEffect = (getData, deps, defaultState = undefined) => {
    const [data, setData] = useState(defaultState);
    const [error, setError] = useState();
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
            .catch((e) => {
                if (!unmounted) {
                    setLoading(false);
                    setError(e);
                }
            });

        return () => {
            unmounted = true;
            controller.abort();
        };
    }, deps);

    return { data, isLoading, error };
};
