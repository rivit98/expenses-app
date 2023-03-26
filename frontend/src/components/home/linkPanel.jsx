import { Box, SimpleGrid } from '@chakra-ui/react';
import { Link, Link as ReactRouterLink } from 'react-router-dom';

const SingleLink = ({ url, children }) => {
    return (
        <Link as={ReactRouterLink} to={url} color="teal.500">
            <Box
                my="auto"
                mx="auto"
                w="full"
                p={5}
                textAlign="center"
                _hover={{
                    background: 'teal',
                }}
                background="teal"
                color="whiteAlpha.800"
                rounded="md"
            >
                {children}
            </Box>
        </Link>
    );
};

export const LinkPanel = () => {
    return (
        <SimpleGrid columns={3} spacing={2} mt={8}>
            <SingleLink url="all">All expenses</SingleLink>
            <SingleLink url="chart">Chart</SingleLink>
            <SingleLink url="summary">Monthly summary</SingleLink>
        </SimpleGrid>
    );
};
