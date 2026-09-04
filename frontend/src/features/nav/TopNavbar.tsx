import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { toaster } from '../../components/Toaster';
import { Tooltip } from '../../components/Tooltip';
import { texts } from '../../constants/texts';
import { currentUserData, isLoggedIn, removeUser } from '../../store/userReducer';

export const TopNavbar = () => {
    const dispatch = useDispatch();
    const { username } = useSelector(currentUserData);
    const logged: boolean = useSelector(isLoggedIn) || false;
    const queryClient = useQueryClient();

    const logOut = (): void => {
        toaster.create({
            description: texts.auth.signedOut,
            type: 'success',
            duration: 3000,
            closable: true,
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
                <Link asChild _hover={{ textDecoration: 'none' }}>
                    <ReactRouterLink to="/">{texts.nav.appTitle}</ReactRouterLink>
                </Link>
            </Text>
            <Box display="flex" flex={1} justifyContent="flex-end">
                {logged && (
                    <Tooltip label={texts.auth.loggedAs(username ?? '')}>
                        <Button onClick={logOut} colorPalette="teal" size="sm" mx={2}>
                            {texts.auth.logOut}
                        </Button>
                    </Tooltip>
                )}
            </Box>
        </Flex>
    );
};
