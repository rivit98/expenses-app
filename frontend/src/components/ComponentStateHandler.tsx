import { Alert, Spinner } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { texts } from '../constants/texts';

interface ComponentStateHandlerProps {
    children: ReactNode;
    queries: UseQueryResult[];
}

export const ComponentStateHandler = ({ children, queries }: ComponentStateHandlerProps) => {
    const isLoading = queries.some((q) => q.isLoading);
    const error = queries.find((q) => q.error)?.error;

    if (isLoading) {
        return (
            <Spinner
                borderWidth="4px"
                animationDuration="0.6s"
                css={{ '--spinner-track-color': 'colors.gray.200' }}
                color="gray.500"
                size="xl"
            />
        );
    }

    if (error) {
        console.error(error);
        return (
            <Alert.Root status="error" color="gray.700">
                <Alert.Indicator />
                <Alert.Content>{error instanceof Error ? error.message : texts.common.unknownError}</Alert.Content>
            </Alert.Root>
        );
    }

    return children;
};
