import {
    Alert,
    AlertIcon,
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { formTexts } from '../generic/formTexts';
import { expensesService } from '../../services/expenses';
import formatDate from '../../utils/dateformatter';

export const DeleteExpense = ({ expense, updateFunc }) => {
    const { id: itemId, amount, date, comment } = expense;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const { isOpen, onOpen, onClose: onCloseInner } = useDisclosure();

    const onClose = () => {
        setError(undefined);
        setLoading(false);
        onCloseInner();
    };

    const resetCallback = () => {
        setLoading(false);
    };

    const successCallback = () => {
        updateFunc({ type: 'delete', payload: itemId });
        onClose();
    };

    const errorCallback = (err) => {
        console.error(err);
        setError(formTexts.genericError);
    };

    const onSubmit = () => {
        if (loading) {
            return;
        }
        setError(undefined);
        setLoading(true);
        expensesService.deleteExpense(itemId).then(successCallback).catch(errorCallback).finally(resetCallback);
    };

    return (
        <>
            <IconButton colorScheme="red" size="sm" onClick={onOpen} icon={<DeleteIcon />} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete expense?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {`${formatDate(date)}  ${amount} zł  ${comment}`}
                        <ModalFooter>
                            <Button
                                colorScheme="red"
                                isLoading={loading}
                                onClick={onSubmit}
                                leftIcon={<DeleteIcon />}
                                mr={2}
                            >
                                Delete
                            </Button>
                            <Button colorScheme="teal" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>

                        {error !== undefined && (
                            <Alert status="error" mb={2}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
