import { EditIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormErrorMessage,
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
import { useForm } from 'react-hook-form';
import { expensesService } from '../../services/expenses';
import { formTexts } from '../generic/formTexts';

export const EditExpense = ({ expense, categories, updateFunc }) => {
    const { id: itemId, amount, date, comment, category } = expense;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({ mode: 'all' });

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(undefined);

    const resetCallback = () => {
        setLoading(false);
    };

    const successCallback = (data) => {
        updateFunc({
            type: 'update',
            payload: data,
        });
        onClose();
    };

    const errorCallback = (e) => {
        console.error(e);
        const err = e.response?.data;
        try {
            Object.entries({
                name: err?.name?.slice(0, 1)[0],
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

    const onSubmit = (data) => {
        if (loading) {
            return;
        }
        setLoading(true);
        setErrorText(undefined);
        expensesService.updateExpense(itemId, data).then(successCallback).catch(errorCallback).finally(resetCallback);
    };

    const open = () => {
        reset();
        onOpen();
        setErrorText(undefined);
    };

    return (
        <>
            <IconButton colorScheme="teal" size="sm" onClick={open} icon={<EditIcon />} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update map</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmit)} method="POST">
                            <Stack spacing={2}>
                                <FormControl isInvalid={errors.date}>
                                    <Input
                                        type="date"
                                        defaultValue={date.toISOString().split('T')[0]}
                                        {...register('date', {})}
                                    />
                                    <FormErrorMessage>{errors.date && errors.date.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.amount}>
                                    <Input
                                        type="number"
                                        step={0.01}
                                        defaultValue={amount}
                                        placeholder="Amount"
                                        _placeholder={{ color: 'whiteAlpha.500' }}
                                        {...register('amount', {})}
                                    />
                                    <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.category}>
                                    <Select
                                        defaultValue={category}
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
                                        defaultValue={comment}
                                        placeholder="Comment"
                                        _placeholder={{ color: 'whiteAlpha.500' }}
                                        {...register('comment', {
                                            maxLength: 128,
                                        })}
                                    />
                                    <FormErrorMessage>{errors.comment && errors.comment.message}</FormErrorMessage>
                                </FormControl>
                                <Button w="full" colorScheme="teal" isLoading={loading} type="submit">
                                    Update
                                </Button>

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
