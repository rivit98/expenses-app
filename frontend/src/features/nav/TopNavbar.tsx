import { Box, Button, Flex, Link, Text, Tooltip, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { removeUser, currentUserData, isLoggedIn } from '../../store/userReducer';
import { texts } from '../../constants/texts';

export const TopNavbar = () => {
    const dispatch = useDispatch();
    const { username } = useSelector(currentUserData);
    const logged: boolean = useSelector(isLoggedIn) || false;
    const queryClient = useQueryClient();
    const toast = useToast();

    const logOut = (): void => {
        toast({
            title: '',
            description: texts.auth.signedOut,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        dispatch(removeUser());
        queryClient.clear();
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
                <Link as={ReactRouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                    {texts.nav.appTitle}
                </Link>
            </Text>
            <Box display="flex" flex={1} justifyContent="flex-end">
                {logged && (
                    <Tooltip label={texts.auth.loggedAs(username ?? '')}>
                        <Button onClick={logOut} colorScheme="teal" size="sm" mx={2}>
                            {texts.auth.logOut}
                        </Button>
                    </Tooltip>
                )}
            </Box>
        </Flex>
    );
};
