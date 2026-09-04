import { Toaster as ChakraToaster, createToaster, Portal, Spinner, Stack, Toast } from '@chakra-ui/react';

// v3 drops useToast/createStandaloneToast in favour of a single toaster instance
// that any module can import. <Toaster /> renders its outlet once, inside the provider.
export const toaster = createToaster({
    placement: 'bottom-end',
    pauseOnPageIdle: true,
});

export const Toaster = () => {
    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
                {(toast) => (
                    <Toast.Root width={{ md: 'sm' }}>
                        {toast.type === 'loading' ? <Spinner size="sm" color="blue.solid" /> : <Toast.Indicator />}
                        <Stack gap="1" flex="1" maxWidth="100%">
                            {toast.title !== undefined && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description !== undefined && (
                                <Toast.Description>{toast.description}</Toast.Description>
                            )}
                        </Stack>
                        {toast.closable === true && <Toast.CloseTrigger />}
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    );
};
