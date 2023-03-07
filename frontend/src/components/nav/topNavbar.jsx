import { Box, Button, Flex, Link, Text, Tooltip, useToast } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { removeUser, currentUserData } from '../../context/userReducer';

export const TopNavbar = () => {
    const dispatch = useDispatch();
    const { username } = useSelector(currentUserData);
    const toast = useToast();

    const logOut = () => {
        toast({
            title: '',
            description: 'Signed out',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        dispatch(removeUser());
    };

    return (
        <Flex height="12" alignItems="center" bg="gray.700">
            <Box display="flex" flex={1} justifyContent="flex-start" />

            <Text
                mx="auto"
                fontSize="xl"
                fontFamily="monospace"
                fontWeight="bold"
                display="flex"
                flex={3}
                justifyContent="center"
            >
                <Link as={ReactRouterLink} to="/" style={{ textDecoration: 'none' }}>
                    Expenses App
                </Link>
            </Text>
            <Box display="flex" flex={1} justifyContent="flex-end">
                <Tooltip label={`Logged as: ${username}`}>
                    <Button onClick={logOut} colorScheme="teal" size="sm" mx={2}>
                        Log out
                    </Button>
                </Tooltip>
            </Box>
        </Flex>
    );
};
