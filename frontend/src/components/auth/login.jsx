import { useForm } from 'react-hook-form';
import { Box, Button, Center, FormControl, FormErrorMessage, Heading, Input, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/auth';
import { formTexts } from '../generic/formTexts';
import { removeUser, updateUser } from '../../context/userReducer';

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ mode: 'all' });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loggedCallback = (user) => {
        dispatch(updateUser(user));
        navigate('/');
    };

    const errorCallback = (err) => {
        console.error(err);
        dispatch(removeUser());

        setError('password', {
            type: 'manual',
            message: formTexts.invalidCredentials,
        });
    };

    const onSubmit = (data) => {
        if (loading) {
            return;
        }
        setLoading(true);
        authService
            .login(data)
            .then(loggedCallback)
            .catch(errorCallback)
            .finally(() => setLoading(false));
    };

    return (
        <Box maxW="md" w="full" justifyContent="center">
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
                <Center mb={4}>
                    <Heading>Login</Heading>
                </Center>
                <Stack spacing={2} color="black">
                    <FormControl isInvalid={errors.username}>
                        <Input
                            bg="white"
                            placeholder="Nick"
                            {...register('username', {
                                required: formTexts.requiredField,
                            })}
                        />
                        <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.password}>
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

                <Button mt={4} w="full" colorScheme="teal" isLoading={loading} type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default Login;
