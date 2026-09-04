import { Box, Button, FormControl, FormErrorMessage, Input, Select, Stack, useToast } from '@chakra-ui/react';
import { Parser } from 'expr-eval';
import { useRef } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import { texts } from '../../constants/texts';
import { useAddExpense } from '../../hooks/mutations';
import type { Category } from '../../types/api';
import { round2 } from '../../utils/rounding';

interface AddExpenseProps {
    categories: Category[];
}

export const AddExpense = ({ categories }: AddExpenseProps) => {
    const toast = useToast();
    const addExpenseMutation = useAddExpense();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onSubmit' });

    const errorCallback = (e: { response?: { data?: Record<string, string[]> } }) => {
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
                description: texts.common.genericError,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const onSubmit = (data: FieldValues) => {
        if (addExpenseMutation.isPending) {
            return;
        }
        const submitData = { ...data, amount: round2(Parser.evaluate(data.amount.replaceAll(',', '.'))) };
        addExpenseMutation.mutate(submitData, {
            onSuccess: () => {
                toast({
                    description: texts.expenses.expenseAdded,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                reset();
            },
            onError: (e) => {
                errorCallback(e as { response?: { data?: Record<string, string[]> } });
            },
        });
    };

    const dateFieldRef = useRef<HTMLInputElement>(null);
    const handleDateFieldClick = () => {
        if (dateFieldRef?.current) {
            dateFieldRef.current.showPicker();
        }
    };
    const { ref, ...rest } = register('date');

    return (
        <Box maxW="xl" w="full">
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
                <Stack spacing={2}>
                    <FormControl isInvalid={!!errors.date}>
                        <Input
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            onClick={handleDateFieldClick}
                            {...rest}
                            ref={(e: HTMLInputElement | null) => {
                                ref(e);
                                dateFieldRef.current = e;
                            }}
                        />
                        <FormErrorMessage>{errors.date && (errors.date.message as string)}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.amount}>
                        <Input
                            type="text"
                            placeholder={texts.common.amount}
                            _placeholder={{ color: 'whiteAlpha.500' }}
                            {...register('amount', {
                                validate: {
                                    mathjs: (value: string) => {
                                        try {
                                            Parser.evaluate(value.replaceAll(',', '.'));
                                            return true;
                                        } catch {
                                            return texts.common.invalidExpression;
                                        }
                                    },
                                },
                            })}
                        />
                        <FormErrorMessage>{errors.amount && (errors.amount.message as string)}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.category}>
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
                        <FormErrorMessage>{errors.category && (errors.category.message as string)}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.comment}>
                        <Input
                            type="text"
                            placeholder={texts.common.comment}
                            _placeholder={{ color: 'whiteAlpha.500' }}
                            {...register('comment', {
                                maxLength: 128,
                            })}
                        />
                        <FormErrorMessage>{errors.comment && (errors.comment.message as string)}</FormErrorMessage>
                    </FormControl>
                    <Button w="full" colorScheme="teal" isLoading={addExpenseMutation.isPending} type="submit">
                        {texts.expenses.addExpense}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
