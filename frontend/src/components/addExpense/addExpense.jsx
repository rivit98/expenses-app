import { Box, Button, FormControl, FormErrorMessage, Input, Select, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { expensesService } from '../../services/expenses';
import { formTexts } from '../generic/formTexts';

export const AddExpense = ({ categories }) => {
    const toast = useToast();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({ mode: 'all' });

    const [loading, setLoading] = useState(false);

    const resetCallback = () => {
        setLoading(false);
    };

    const successCallback = () => {
        toast({
            description: 'Expense added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        reset();
    };

    const errorCallback = (e) => {
        console.error(e);
        try {
            const err = e.response?.data;
            Object.entries({
                date: err?.date?.slice(0, 1)[0],
                amount: err?.amount?.slice(0, 1)[0],
                category: err?.category?.slice(0, 1)[0],
                comment: err?.comment?.slice(0, 1)[0],
            })
                .filter(([, value]) => value !== undefined)
                .forEach(([key, value]) => {
                    setError(key, {
                        type: 'manual',
                        message: value,
                    });
                });
        } catch {
            toast({
                description: formTexts.genericError,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const onSubmit = (data) => {
        if (loading) {
            return;
        }
        setLoading(true);
        expensesService.addExpense(data).then(successCallback).catch(errorCallback).finally(resetCallback);
    };

    return (
        <Box maxW="xl" w="full">
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
                <Stack spacing={2}>
                    <FormControl isInvalid={errors.date}>
                        <Input
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            {...register('date', {
                                defaultValue: '2023-03-12',
                            })}
                        />
                        <FormErrorMessage>{errors.date && errors.date.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.amount}>
                        <Input type="number" placeholder="Amount" {...register('amount', {})} />
                        <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.category}>
                        <Select
                            {...register('category', {
                                maxLength: 128,
                            })}
                        >
                            {categories.map(({ id, name }) => {
                                return (
                                    <option key={id} value={id} color="#2D3748">
                                        {name}
                                    </option>
                                );
                            })}
                        </Select>
                        <FormErrorMessage>{errors.category && errors.category.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.comment}>
                        <Input
                            type="text"
                            placeholder="Comment"
                            {...register('comment', {
                                maxLength: 128,
                            })}
                        />
                        <FormErrorMessage>{errors.comment && errors.comment.message}</FormErrorMessage>
                    </FormControl>
                    <Button w="full" colorScheme="teal" isLoading={loading} type="submit">
                        Submit
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
