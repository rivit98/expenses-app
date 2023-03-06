import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tr,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { expensesService } from '../../services/expenses';
import { formTexts } from '../generic/formTexts';

const FormRow = ({ label = '', children }) => {
    return (
        <Tr p="0">
            <Td p="1" my="auto">
                <FormLabel>{label}</FormLabel>
            </Td>
            <Td p="1">{children}</Td>
        </Tr>
    );
};

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
                <TableContainer>
                    <Table variant="unstyled">
                        <Tbody>
                            <FormRow label="Date">
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
                            </FormRow>
                            <FormRow label="Amount">
                                <FormControl isInvalid={errors.amount}>
                                    <Input type="number" {...register('amount', {})} />
                                    <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
                                </FormControl>
                            </FormRow>
                            <FormRow label="Category">
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
                            </FormRow>
                            <FormRow label="Comment">
                                <FormControl isInvalid={errors.comment}>
                                    <Input
                                        type="text"
                                        {...register('comment', {
                                            maxLength: 128,
                                        })}
                                    />
                                    <FormErrorMessage>{errors.comment && errors.comment.message}</FormErrorMessage>
                                </FormControl>
                            </FormRow>
                            <FormRow>
                                <Button w="full" colorScheme="teal" isLoading={loading} type="submit">
                                    Submit
                                </Button>
                            </FormRow>
                        </Tbody>
                    </Table>
                </TableContainer>
            </form>
        </Box>
    );
};
