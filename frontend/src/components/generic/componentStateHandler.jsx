import { Alert, AlertIcon, Spinner } from '@chakra-ui/react';

export const ComponentStateHandler = ({ children, state: { error, isLoading, data } }) => {
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

export const getAggregatedState = (...funcs) => {
    return (options = undefined) => {
        return Promise.all(funcs.map((f) => f.apply(options)));
    };
};
