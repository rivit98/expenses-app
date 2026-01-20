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
import { useForm } from 'react-hook-form';
import { evaluate } from 'mathjs';
import { formTexts } from '../generic/formTexts';
import { metersService } from '../../services/meters';
import { round2 } from '../../utils/rounding';

export const EditMeter = ({ meter, categoryMapping, updateFunc }) => {
    const { id: itemId, read, date, category } = meter;
    const { isOpen, onOpen, onClose: onCloseInner } = useDisclosure();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({ mode: 'all' });

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(undefined);

    const onClose = () => {
        setError(undefined);
        setLoading(false);
        onCloseInner();
    };

    const resetCallback = () => {
        setLoading(false);
    };

    const successCallback = () => {
        updateFunc();
        onClose();
    };

    const errorCallback = (e) => {
        console.error(e);
        const err = e.response?.data;
        try {
            Object.entries({
                date: err?.date?.slice(0, 1)[0],
                read: err?.read?.slice(0, 1)[0],
                category: err?.category?.slice(0, 1)[0],
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

    const updateMeterFunc = (data) => {
        if (loading) {
            return;
        }
        setErrorText(undefined);
        setLoading(true);
        data.read = round2(evaluate(data.read.replaceAll(',', '.')));
        metersService.updateMeter(itemId, data).then(successCallback).catch(errorCallback).finally(resetCallback);
    };

    const deleteMeterFunc = () => {
        if (loading) {
            return;
        }
        setError(undefined);
        setLoading(true);
        metersService.deleteMeter(itemId).then(successCallback).catch(errorCallback).finally(resetCallback);
    };

    const open = () => {
        reset();
        setErrorText(undefined);
        onOpen();
    };

    return (
        <>
            <IconButton colorScheme="teal" size="sm" onClick={open} icon={<EditIcon />} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update meter</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit(updateMeterFunc)} method="POST">
                            <Stack spacing={2}>
                                <FormControl isInvalid={errors.date}>
                                    <Input
                                        type="date"
                                        defaultValue={date.toISOString().split('T')[0]}
                                        {...register('date', {})}
                                    />
                                    <FormErrorMessage>{errors.date && errors.date.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.read}>
                                    <Input
                                        type="text"
                                        step={0.01}
                                        defaultValue={read}
                                        placeholder="Read"
                                        _placeholder={{ color: 'whiteAlpha.500' }}
                                        {...register('read', {
                                            validate: {
                                                mathjs: (value) => {
                                                    try {
                                                        evaluate(value.replaceAll(',', '.'));
                                                        return true;
                                                    } catch {
                                                        return 'Invalid expression';
                                                    }
                                                },
                                            },
                                        })}
                                    />
                                    <FormErrorMessage>{errors.read && errors.read.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={errors.category}>
                                    <Select
                                        defaultValue={category}
                                        {...register('category', {
                                            maxLength: 128,
                                        })}
                                    >
                                        {Object.entries(categoryMapping).map(([id, { name }]) => {
                                            return (
                                                <option key={id} value={id} color="#2D3748">
                                                    {name}
                                                </option>
                                            );
                                        })}
                                    </Select>
                                    <FormErrorMessage>{errors.category && errors.category.message}</FormErrorMessage>
                                </FormControl>
                                <HStack>
                                    <Button w="full" colorScheme="teal" isLoading={loading} type="submit">
                                        Update
                                    </Button>
                                    <IconButton colorScheme="red" onClick={deleteMeterFunc} icon={<DeleteIcon />} />
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
