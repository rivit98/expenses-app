import { ReactNode } from 'react';
import { Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';

interface ComponentStateHandlerProps {
    children: ReactNode;
    queries: UseQueryResult[];
}

export const ComponentStateHandler = ({ children, queries }: ComponentStateHandlerProps) => {
    const isLoading = queries.some((q) => q.isLoading);
    const error = queries.find((q) => q.error)?.error;

    if (isLoading) {
        return <Spinner thickness="4px" speed="0.6s" emptyColor="gray.200" color="gray.500" size="xl" />;
    }

    if (error) {
        console.error(error);
        return (
            <Alert status="error" color="gray.700">
                <AlertIcon />
                {error instanceof Error ? error.message : 'An error occurred'}
            </Alert>
        );
    }

    return children;
};
