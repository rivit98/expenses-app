import { Box, Button, Center, FormControl, FormErrorMessage, Heading, Input, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { texts } from '../../constants/texts';
import { useLogin } from '../../hooks/mutations';
import { removeUser, updateUser } from '../../store/userReducer';
import type { LoginData, UserData } from '../../types/api';

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginData>({ mode: 'all' });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const loginMutation = useLogin();

    const redirectTo = (location.state as { from?: string })?.from ?? '/';

    const onSubmit = (data: LoginData): void => {
        if (loginMutation.isPending) {
            return;
        }
        loginMutation.mutate(data, {
            onSuccess: (user: UserData) => {
                dispatch(updateUser(user));
                navigate(redirectTo, { replace: true });
            },
            onError: (err: unknown) => {
                console.error(err);
                dispatch(removeUser());
                const isAuthError =
                    axios.isAxiosError(err) && (err.response?.status === 400 || err.response?.status === 401);
                setError('password', {
                    type: 'manual',
                    message: isAuthError ? texts.auth.invalidCredentials : texts.common.genericError,
                });
            },
        });
    };

    return (
        <Box maxW="md" w="full" justifyContent="center">
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
                <Center mb={4}>
                    <Heading>{texts.auth.loginHeading}</Heading>
                </Center>
                <Stack spacing={2} color="black">
                    <FormControl isInvalid={!!errors.username}>
                        <Input
                            bg="white"
                            placeholder={texts.auth.usernamePlaceholder}
                            {...register('username', {
                                required: texts.auth.requiredField,
                            })}
                        />
                        <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password}>
                        <Input
                            bg="white"
                            type="password"
                            placeholder={texts.auth.passwordPlaceholder}
                            {...register('password', {
                                required: texts.auth.requiredField,
                            })}
                        />
                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                    </FormControl>
                </Stack>

                <Button mt={4} w="full" colorScheme="teal" isLoading={loginMutation.isPending} type="submit">
                    {texts.common.submit}
                </Button>
            </form>
        </Box>
    );
};

export default Login;
