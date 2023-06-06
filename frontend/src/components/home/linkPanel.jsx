import { Flex, SimpleGrid } from '@chakra-ui/react';
import { Link, Link as ReactRouterLink } from 'react-router-dom';

const SingleLink = ({ url, children }) => {
    return (
        <Link as={ReactRouterLink} to={url} color="teal.500">
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
        </Link>
    );
};

export const LinkPanel = () => {
    return (
        <SimpleGrid columns={4} spacing={2} mt={8} maxW="xl" w="full">
            <SingleLink url="all">All expenses</SingleLink>
            <SingleLink url="summary">Monthly summary</SingleLink>
            <SingleLink url="chart">Chart</SingleLink>
            <SingleLink url="meters">Meters</SingleLink>
        </SimpleGrid>
    );
};
