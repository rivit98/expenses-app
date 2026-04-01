import { ReactNode } from 'react';
import { Flex, Link as ChakraLink, SimpleGrid } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

interface SingleLinkProps {
    url: string;
    children: ReactNode;
}

const SingleLink = ({ url, children }: SingleLinkProps) => {
    return (
        <ChakraLink as={ReactRouterLink} to={url} color="teal.500">
            <Flex
                h="full"
                py={3}
                textAlign="center"
                background="teal"
                color="whiteAlpha.800"
                rounded="md"
                alignItems="center"
                justifyContent="center"
            >
                {children}
            </Flex>
        </ChakraLink>
    );
};

export const LinkPanel = () => {
    return (
        <SimpleGrid columns={3} spacing={2} mt={8} maxW="xl" w="full">
            <SingleLink url="all">All expenses</SingleLink>
            <SingleLink url="summary">Monthly summary</SingleLink>
            <SingleLink url="meters">Meters</SingleLink>
        </SimpleGrid>
    );
};
