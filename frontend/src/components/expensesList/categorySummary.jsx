import { Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { round2 } from '../../utils/rounding';
import { byNumber, reverse } from '../generic/sortUtil';

export const CategorySummary = ({ expenses, categoryMapping }) => {
    const summary = {};
    Object.keys(categoryMapping).forEach((k) => {
        summary[k] = 0.0;
    });

    expenses.forEach((e) => {
        summary[e.category] += e.amount;
    });

    const totalSum = Object.values(summary).reduce((acc, c) => acc + c, 0);

    return (
        <TableContainer maxW="sm" mt={10}>
            <Table size="md" variant="striped" colorScheme="whiteAlpha">
                <Thead>
                    <Tr>
                        <Th>Category</Th>
                        <Th>Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(summary)
                        .sort((c1, c2) => reverse(byNumber(c1[1], c2[1])))
                        .map(([k, amount]) => {
                            return (
                                <Tr key={k}>
                                    <Td>{categoryMapping[k]}</Td>
                                    <Td>{round2(amount)} zł</Td>
                                </Tr>
                            );
                        })}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>
                            <Text fontSize="md">Total</Text>
                        </Th>
                        <Th>
                            <Text fontSize="md">{round2(totalSum)} zł</Text>
                        </Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};
