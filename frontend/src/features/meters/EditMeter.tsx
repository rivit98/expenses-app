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
import { useDeleteMeter, useUpdateMeter } from '../../hooks/mutations';
import type { MeterCategoryMapping, ParsedMeter } from '../../types/api';
import { round2 } from '../../utils/rounding';

interface EditMeterProps {
    meter: ParsedMeter;
    categoryMapping: MeterCategoryMapping;
}

export const EditMeter = ({ meter, categoryMapping }: EditMeterProps) => {
    const { id: itemId, read, date, category } = meter;
    const { open: isOpen, onOpen, onClose: onCloseInner } = useDisclosure();

    const updateMeterMutation = useUpdateMeter();
    const deleteMeterMutation = useDeleteMeter();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({ mode: 'all' });

    const [errorText, setErrorText] = useState<string | undefined>(undefined);
    const isPending = updateMeterMutation.isPending || deleteMeterMutation.isPending;

    const onClose = () => {
        reset();
        onCloseInner();
    };

    const errorCallback = (e: { response?: { data?: Record<string, string[]> } }) => {
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
            setErrorText(texts.common.genericError);
        }
    };

    const updateMeterFunc = (data: FieldValues) => {
        if (isPending) {
            return;
        }
        setErrorText(undefined);
        const submitData = { ...data, read: round2(Parser.evaluate(data.read.replaceAll(',', '.'))) };
        updateMeterMutation.mutate(
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

    const deleteMeterFunc = () => {
        if (isPending) {
            return;
        }
        reset();
        deleteMeterMutation.mutate(itemId, {
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
            <IconButton colorPalette="teal" size="sm" onClick={open} aria-label={texts.meters.editMeter}>
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
                                <Dialog.Title>{texts.meters.updateMeter}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                            <Dialog.Body>
                                <form onSubmit={handleSubmit(updateMeterFunc)} method="POST">
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
                                        <Field.Root invalid={!!errors.read}>
                                            <Input
                                                type="text"
                                                step={0.01}
                                                defaultValue={read}
                                                placeholder={texts.meters.read}
                                                _placeholder={{ color: 'whiteAlpha.500' }}
                                                {...register('read', {
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
                                                {errors.read && (errors.read.message as string)}
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
                                                    {Object.entries(categoryMapping).map(([id, { name }]) => {
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
                                        <HStack>
                                            <Button w="full" colorPalette="teal" loading={isPending} type="submit">
                                                {texts.common.update}
                                            </Button>
                                            <IconButton
                                                colorPalette="red"
                                                onClick={deleteMeterFunc}
                                                aria-label={texts.meters.deleteMeter}
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
