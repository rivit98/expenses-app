import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

interface TooltipProps {
    label: ReactNode;
    children: ReactElement;
}

// v2's single <Tooltip label> became a Root/Trigger/Positioner/Content set in v3.
export const Tooltip = ({ label, children }: TooltipProps) => {
    return (
        <ChakraTooltip.Root>
            <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
            <Portal>
                <ChakraTooltip.Positioner>
                    <ChakraTooltip.Content>{label}</ChakraTooltip.Content>
                </ChakraTooltip.Positioner>
            </Portal>
        </ChakraTooltip.Root>
    );
};
