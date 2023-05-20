import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { round2 } from '../../utils/rounding';
import { byNumber, reverse } from '../generic/sortUtil';

export const CategorySummary = ({ meters, categoryMapping }) => {
    const summary = {};
    Object.keys(categoryMapping).forEach((k) => {
        summary[k] = 0.0;
    });

    meters.forEach((e) => {
        summary[e.category] += e.read;
    });

    return (
        <TableContainer maxW="xl" w="full" mt={10}>
            <Table size="md" variant="striped" colorScheme="whiteAlpha">
                <Thead>
                    <Tr>
                        <Th>Category</Th>
                        <Th>Avg per day</Th>
                        <Th>Avg per month</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(summary)
                        .sort((c1, c2) => reverse(byNumber(c1[1], c2[1])))
                        .map(([k, amount]) => {
                            return (
                                <Tr
                                    key={k}
                                    _hover={{
                                        background: 'whiteAlpha.300',
                                        color: 'teal.300',
                                    }}
                                >
                                    <Td>{categoryMapping[k]}</Td>
                                    <Td>{round2(amount)} zł</Td>
                                    <Td>{round2(amount)} zł</Td>
                                </Tr>
                            );
                        })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
