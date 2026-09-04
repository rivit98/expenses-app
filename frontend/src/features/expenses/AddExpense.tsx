import { Box, Button, Field, Input, NativeSelect, Stack } from '@chakra-ui/react';
import { Parser } from 'expr-eval';
import { useRef } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import { toaster } from '../../components/Toaster';
import { texts } from '../../constants/texts';
import { useAddExpense } from '../../hooks/mutations';
import type { Category } from '../../types/api';
import { round2 } from '../../utils/rounding';

interface AddExpenseProps {
    categories: Category[];
}

export const AddExpense = ({ categories }: AddExpenseProps) => {
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
            toaster.create({
                description: texts.common.genericError,
                type: 'error',
                duration: 3000,
                closable: true,
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
                toaster.create({
                    description: texts.expenses.expenseAdded,
                    type: 'success',
                    duration: 3000,
                    closable: true,
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
                <Stack gap={2}>
                    <Field.Root invalid={!!errors.date}>
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
                        <Field.ErrorText>{errors.date && (errors.date.message as string)}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.amount}>
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
                        <Field.ErrorText>{errors.amount && (errors.amount.message as string)}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.category}>
                        <NativeSelect.Root>
                            <NativeSelect.Field
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
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <Field.ErrorText>{errors.category && (errors.category.message as string)}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.comment}>
                        <Input
                            type="text"
                            placeholder={texts.common.comment}
                            _placeholder={{ color: 'whiteAlpha.500' }}
                            {...register('comment', {
                                maxLength: 128,
                            })}
                        />
                        <Field.ErrorText>{errors.comment && (errors.comment.message as string)}</Field.ErrorText>
                    </Field.Root>
                    <Button w="full" colorPalette="teal" loading={addExpenseMutation.isPending} type="submit">
                        {texts.expenses.addExpense}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
