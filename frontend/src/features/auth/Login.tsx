import { useForm } from 'react-hook-form';
import { Box, Button, Center, FormControl, FormErrorMessage, Heading, Input, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formTexts } from '../generic/formTexts';
import { removeUser, updateUser } from '../../context/userReducer';
import { LoginData, UserData } from '../../types/api';
import { useLogin } from '../../hooks/mutations';

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginData>({ mode: 'all' });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginMutation = useLogin();

    const onSubmit = (data: LoginData): void => {
        if (loginMutation.isPending) {
            return;
        }
        loginMutation.mutate(data, {
            onSuccess: (user: UserData) => {
                dispatch(updateUser(user));
                navigate('/');
            },
            onError: (err: unknown) => {
                console.error(err);
                dispatch(removeUser());
                setError('password', {
                    type: 'manual',
                    message: formTexts.invalidCredentials,
                });
            },
        });
    };

    return (
        <Box maxW="md" w="full" justifyContent="center">
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
                <Center mb={4}>
                    <Heading>Login</Heading>
                </Center>
                <Stack spacing={2} color="black">
                    <FormControl isInvalid={!!errors.username}>
                        <Input
                            bg="white"
                            placeholder="Nick"
                            {...register('username', {
                                required: formTexts.requiredField,
                            })}
                        />
                        <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password}>
                        <Input
                            bg="white"
                            type="password"
                            placeholder="Password"
                            {...register('password', {
                                required: formTexts.requiredField,
                            })}
                        />
                        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                    </FormControl>
                </Stack>

                <Button mt={4} w="full" colorScheme="teal" isLoading={loginMutation.isPending} type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default Login;
