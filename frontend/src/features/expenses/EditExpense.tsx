import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Parser } from 'expr-eval';
import { CategoryMapping, ParsedExpense } from '../../types/api';
import { formTexts } from '../../constants/formTexts';
import { round2 } from '../../utils/rounding';
import { useUpdateExpense, useDeleteExpense } from '../../hooks/mutations';

interface EditExpenseProps {
    expense: ParsedExpense;
    categoryMapping: CategoryMapping;
}

export const EditExpense = ({ expense, categoryMapping }: EditExpenseProps) => {
    const { id: itemId, amount, date, comment, category } = expense;
    const { isOpen, onOpen, onClose: onCloseInner } = useDisclosure();

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
            setErrorText(formTexts.genericError);
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
            <IconButton colorScheme="teal" size="sm" onClick={open} icon={<EditIcon />} aria-label="Edit expense" />

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update expense</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit(updateExpenseFunc)} method="POST">
                            <Stack spacing={2}>
                                <FormControl isInvalid={!!errors.date}>
                                    <Input
                                        type="date"
                                        defaultValue={date.toISOString().split('T')[0]}
                                        {...register('date', {})}
                                    />
                                    <FormErrorMessage>
                                        {errors.date && (errors.date.message as string)}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.amount}>
                                    <Input
                                        type="text"
                                        placeholder="Amount"
                                        _placeholder={{ color: 'whiteAlpha.500' }}
                                        defaultValue={amount}
                                        {...register('amount', {
                                            validate: {
                                                mathjs: (value: string) => {
                                                    try {
                                                        Parser.evaluate(value.replaceAll(',', '.'));
                                                        return true;
                                                    } catch {
                                                        return 'Invalid expression';
                                                    }
                                                },
                                            },
                                        })}
                                    />
                                    <FormErrorMessage>
                                        {errors.amount && (errors.amount.message as string)}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.category}>
                                    <Select
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
                                    </Select>
                                    <FormErrorMessage>
                                        {errors.category && (errors.category.message as string)}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.comment}>
                                    <Input
                                        type="text"
                                        defaultValue={comment}
                                        placeholder="Comment"
                                        _placeholder={{ color: 'whiteAlpha.500' }}
                                        {...register('comment', {
                                            maxLength: 128,
                                        })}
                                    />
                                    <FormErrorMessage>
                                        {errors.comment && (errors.comment.message as string)}
                                    </FormErrorMessage>
                                </FormControl>
                                <HStack>
                                    <Button w="full" colorScheme="teal" isLoading={isPending} type="submit">
                                        Update
                                    </Button>
                                    <IconButton
                                        colorScheme="red"
                                        onClick={deleteExpenseFunc}
                                        icon={<DeleteIcon />}
                                        aria-label="Delete expense"
                                    />
                                </HStack>

                                {errorText !== undefined && (
                                    <Alert status="error" mb={2}>
                                        <AlertIcon />
                                        {errorText}
                                    </Alert>
                                )}
                            </Stack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
