import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { TopNavbar } from './TopNavbar';

interface NavigationProps {
    children: ReactNode;
}

export const Navigation = ({ children }: NavigationProps) => {
    return (
        <Box minH="100vh" bg="blackAlpha.900" color="whiteAlpha.500">
            <TopNavbar />
            <Box p="4" w="full">
                {children}
            </Box>
        </Box>
    );
};
