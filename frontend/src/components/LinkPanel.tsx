import { Link as ChakraLink, Flex, SimpleGrid } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { texts } from '../constants/texts';

interface SingleLinkProps {
    url: string;
    children: ReactNode;
}

const SingleLink = ({ url, children }: SingleLinkProps) => {
    return (
        <ChakraLink as={ReactRouterLink} to={url} color="teal.500" _hover={{ textDecoration: 'none' }}>
            <Flex
                h="full"
                py={3}
                textAlign="center"
                background="teal"
                color="whiteAlpha.800"
                rounded="md"
                alignItems="center"
                justifyContent="center"
                _hover={{ background: 'teal.600' }}
            >
                {children}
            </Flex>
        </ChakraLink>
    );
};

export const LinkPanel = () => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={2} mt={8} maxW="xl" w="full">
            <SingleLink url="all">{texts.nav.allExpenses}</SingleLink>
            <SingleLink url="summary">{texts.nav.monthlySummary}</SingleLink>
            <SingleLink url="meters">{texts.nav.meters}</SingleLink>
        </SimpleGrid>
    );
};
