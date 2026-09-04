import { Badge, Table, Text } from '@chakra-ui/react';
import { texts } from '../../constants/texts';
import type { MeterCategoryMapping, ParsedMeter } from '../../types/api';
import { getBadgeColor } from '../../utils/badgeColor';
import formatDate from '../../utils/dateFormatter';
import { EditMeter } from './EditMeter';

interface MetersListProps {
    meters: ParsedMeter[];
    categoryMapping: MeterCategoryMapping;
}

export const MetersList = ({ meters, categoryMapping }: MetersListProps) => {
    if (meters.length === 0) {
        return null;
    }

    return (
        <Table.ScrollArea maxW="xl" w="full" mt={10}>
            <Table.Root size="sm" striped colorPalette="whiteAlpha">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader pr={1} pl={0} w="1">
                            {texts.common.date}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader pr={1} w="1">
                            {texts.common.category}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader w="1" textAlign="center">
                            {texts.meters.read}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader w="1" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {meters.map((meter) => {
                        const { id, read, date, category } = meter;
                        return (
                            <Table.Row
                                key={id}
                                _hover={{
                                    background: 'whiteAlpha.300',
                                    color: 'teal.300',
                                }}
                            >
                                <Table.Cell px={2} py={0}>
                                    {formatDate(date).substring(0, 10)}
                                </Table.Cell>
                                <Table.Cell px={2} py={0}>
                                    <Badge ml={2} {...getBadgeColor(categoryMapping[category].name)}>
                                        {categoryMapping[category].name}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Text>
                                        {read} {categoryMapping[category].unit}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell px={1}>
                                    <EditMeter meter={meter} categoryMapping={categoryMapping} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};
