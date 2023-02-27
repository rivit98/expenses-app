import { Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

export const TopNavbar = () => {
    return (
        <Flex height="12" alignItems="center" bg="gray.700">
            <Text mx="auto" fontSize="xl" fontFamily="monospace" fontWeight="bold">
                <Link as={ReactRouterLink} to="/" style={{ textDecoration: 'none' }}>
                    Expenses App
                </Link>
            </Text>
        </Flex>
    );
};
