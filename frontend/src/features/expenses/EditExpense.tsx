import {
    Alert,
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    IconButton,
    Input,
    NativeSelect,
    Portal,
    Stack,
    useDisclosure,
} from '@chakra-ui/react';
import { Parser } from 'expr-eval';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import { texts } from '../../constants/texts';
import { useDeleteExpense, useUpdateExpense } from '../../hooks/mutations';
import type { CategoryMapping, ParsedExpense } from '../../types/api';
import { round2 } from '../../utils/rounding';

interface EditExpenseProps {
    expense: ParsedExpense;
    categoryMapping: CategoryMapping;
}

export const EditExpense = ({ expense, categoryMapping }: EditExpenseProps) => {
    const { id: itemId, amount, date, comment, category } = expense;
    const { open: isOpen, onOpen, onClose: onCloseInner } = useDisclosure();

    const updateExpenseMutation = useUpdateExpense();
    const deleteExpenseMutation = useDeleteExpense();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({ mode: 'all' });

    const [errorText, setErrorText] = useState<string | undefined>(undefined);
    const isPending = updateExpenseMutation.isPending || deleteExpenseMutation.isPending;

    const onClose = () => {
        clearErrors();
        onCloseInner();
    };

    const errorCallback = (e: { response?: { data?: Record<string, string[]> } }) => {
        console.error(e);
        const err = e.response?.data;
        try {
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
            setErrorText(texts.common.genericError);
        }
    };

    const updateExpenseFunc = (data: FieldValues) => {
        if (isPending) {
            return;
        }
        setErrorText(undefined);
        const submitData = { ...data, amount: round2(Parser.evaluate(data.amount.replaceAll(',', '.'))) };
        updateExpenseMutation.mutate(
            { id: itemId, data: submitData },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (e) => {
                    errorCallback(e as { response?: { data?: Record<string, string[]> } });
                },
            }
        );
    };

    const deleteExpenseFunc = () => {
        if (isPending) {
            return;
        }
        clearErrors();
        deleteExpenseMutation.mutate(itemId, {
            onSuccess: () => {
                onClose();
            },
            onError: (e) => {
                errorCallback(e as { response?: { data?: Record<string, string[]> } });
            },
        });
    };

    const open = () => {
        reset();
        setErrorText(undefined);
        onOpen();
    };

    return (
        <>
            <IconButton colorPalette="teal" size="sm" onClick={open} aria-label={texts.expenses.editExpense}>
                <Pencil />
            </IconButton>

            <Dialog.Root
                open={isOpen}
                onOpenChange={(details) => {
                    if (!details.open) {
                        onClose();
                    }
                }}
                placement="center"
                size="lg"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>{texts.expenses.updateExpense}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                            <Dialog.Body>
                                <form onSubmit={handleSubmit(updateExpenseFunc)} method="POST">
                                    <Stack gap={2}>
                                        <Field.Root invalid={!!errors.date}>
                                            <Input
                                                type="date"
                                                defaultValue={date.toISOString().split('T')[0]}
                                                {...register('date', {})}
                                            />
                                            <Field.ErrorText>
                                                {errors.date && (errors.date.message as string)}
                                            </Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root invalid={!!errors.amount}>
                                            <Input
                                                type="text"
                                                placeholder={texts.common.amount}
                                                _placeholder={{ color: 'whiteAlpha.500' }}
                                                defaultValue={amount}
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
                                            <Field.ErrorText>
                                                {errors.amount && (errors.amount.message as string)}
                                            </Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root invalid={!!errors.category}>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field
                                                    defaultValue={category}
                                                    {...register('category', {
                                                        maxLength: 128,
                                                    })}
                                                >
                                                    {Object.entries(categoryMapping).map(([id, name]) => {
                                                        return (
                                                            <option key={id} value={id} color="#2D3748">
                                                                {name}
                                                            </option>
                                                        );
                                                    })}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                            <Field.ErrorText>
                                                {errors.category && (errors.category.message as string)}
                                            </Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root invalid={!!errors.comment}>
                                            <Input
                                                type="text"
                                                defaultValue={comment}
                                                placeholder={texts.common.comment}
                                                _placeholder={{ color: 'whiteAlpha.500' }}
                                                {...register('comment', {
                                                    maxLength: 128,
                                                })}
                                            />
                                            <Field.ErrorText>
                                                {errors.comment && (errors.comment.message as string)}
                                            </Field.ErrorText>
                                        </Field.Root>
                                        <HStack>
                                            <Button w="full" colorPalette="teal" loading={isPending} type="submit">
                                                {texts.common.update}
                                            </Button>
                                            <IconButton
                                                colorPalette="red"
                                                onClick={deleteExpenseFunc}
                                                aria-label={texts.expenses.deleteExpense}
                                            >
                                                <Trash2 />
                                            </IconButton>
                                        </HStack>

                                        {errorText !== undefined && (
                                            <Alert.Root status="error" mb={2}>
                                                <Alert.Indicator />
                                                <Alert.Content>{errorText}</Alert.Content>
                                            </Alert.Root>
                                        )}
                                    </Stack>
                                </form>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};
