import { Box } from '@chakra-ui/react';
import React from 'react';
import { TopNavbar } from './topNavbar';

export const Navigation = ({ children }) => {
    return (
        <Box minH="100vh" bg="blackAlpha.900" color="whiteAlpha.500">
            <TopNavbar />
            <Box p="4" w="full">
                {children}
            </Box>
        </Box>
    );
};
