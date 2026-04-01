import { Box, Button, FormControl, FormErrorMessage, Input, Select, Stack, useToast } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { evaluate } from 'mathjs';
import { formTexts } from '../generic/formTexts';
import { metersService } from '../../services/meters';
import { round2 } from '../../utils/rounding';
import { MeterCategory } from '../../types/api';

interface AddMeterProps {
    categories: MeterCategory[];
    updateFunc: () => void;
}

export const AddMeter = ({ categories, updateFunc }: AddMeterProps) => {
    const toast = useToast();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onSubmit' });

    const [loading, setLoading] = useState(false);

    const resetCallback = () => {
        setLoading(false);
    };

    const successCallback = () => {
        updateFunc();
        toast({
            description: 'Meter added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        reset();
    };

    const errorCallback = (e: { response?: { data?: Record<string, string[]> } }) => {
        console.error(e);
        try {
            const err = e.response?.data;
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
            toast({
                description: formTexts.genericError,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const onSubmit = (data: FieldValues) => {
        if (loading) {
            return;
        }
        setLoading(true);
        data.read = round2(evaluate(data.read.replaceAll(',', '.')));
        metersService.addMeter(data).then(successCallback).catch(errorCallback).finally(resetCallback);
    };

    const dateFieldRef = useRef<HTMLInputElement>(null);
    const handledateFieldClick = () => {
        if (dateFieldRef && dateFieldRef.current) {
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
                            onClick={handledateFieldClick}
                            {...rest}
                            ref={(e: HTMLInputElement | null) => {
                                ref(e);
                                dateFieldRef.current = e;
                            }}
                        />
                        <FormErrorMessage>{errors.date && (errors.date.message as string)}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.read}>
                        <Input
                            type="text"
                            placeholder="Read"
                            _placeholder={{ color: 'whiteAlpha.500' }}
                            {...register('read', {
                                validate: {
                                    mathjs: (value: string) => {
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
                        <FormErrorMessage>{errors.read && (errors.read.message as string)}</FormErrorMessage>
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
                    <Button w="full" colorScheme="teal" isLoading={loading} type="submit">
                        Add meter
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
