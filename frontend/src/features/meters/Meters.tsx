import { ComponentStateHandler } from '../../components/ComponentStateHandler';
import { useMeterCategories, useMeters } from '../../hooks/queries';
import type { MeterCategoryMapping, ParsedMeter } from '../../types/api';
import { AddMeter } from './AddMeter';
import { CategorySummary } from './CategorySummary';
import { MetersList } from './MetersList';

const Meters = () => {
    const categoriesQuery = useMeterCategories();
    const metersQuery = useMeters();

    const categories = categoriesQuery.data ?? [];
    const meters = metersQuery.data ?? [];

    const parsedMeters: ParsedMeter[] = meters.map((m) => {
        return { ...m, date: new Date(m.date), read: parseFloat(m.read) };
    });

    const categoryMapping: MeterCategoryMapping = Object.fromEntries(
        categories.map((item) => [item.id, { name: item.name, unit: item.unit }])
    );

    return (
        <ComponentStateHandler queries={[categoriesQuery, metersQuery]}>
            <AddMeter categories={categories} />
            <MetersList meters={parsedMeters} categoryMapping={categoryMapping} />
            <CategorySummary meters={parsedMeters} categoryMapping={categoryMapping} />
        </ComponentStateHandler>
    );
};

export default Meters;
