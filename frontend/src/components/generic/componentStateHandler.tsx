import { ReactNode } from 'react';
import { Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { AxiosRequestConfig } from 'axios';
import { UseAxiosEffectResult } from '../../hooks/useAxiosEffect';

interface ComponentStateHandlerProps<T> {
    children: ReactNode;
    state: UseAxiosEffectResult<T>;
}

export const ComponentStateHandler = <T,>({
    children,
    state: { error, isLoading, data },
}: ComponentStateHandlerProps<T>) => {
    if (isLoading) {
        return <Spinner thickness="4px" speed="0.6s" emptyColor="gray.200" color="gray.500" size="xl" />;
    }

    if (error || data === undefined) {
        console.error(error);
        return (
            <Alert status="error" color="gray.700">
                <AlertIcon />
                {error?.message}
            </Alert>
        );
    }

    return children;
};

type AsyncFunc = (options?: AxiosRequestConfig) => Promise<unknown>;

export const getAggregatedState = <T extends unknown[]>(...funcs: AsyncFunc[]) => {
    return (options?: AxiosRequestConfig): Promise<T> => {
        return Promise.all(funcs.map((f) => f(options))) as Promise<T>;
    };
};
