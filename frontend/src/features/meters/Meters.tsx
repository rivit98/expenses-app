import { useMeterCategories, useMeters } from '../../hooks/queries';
import { ComponentStateHandler } from '../../components/ComponentStateHandler';
import { AddMeter } from './AddMeter';
import { MetersList } from './MetersList';
import { CategorySummary } from './CategorySummary';
import { MeterCategoryMapping, ParsedMeter } from '../../types/api';

const Meters = () => {
    const categoriesQuery = useMeterCategories();
    const metersQuery = useMeters();

    const categories = categoriesQuery.data ?? [];
    const meters = metersQuery.data ?? [];

    const meters_with_date: ParsedMeter[] = meters.map((m) => {
        return { ...m, date: new Date(m.date), read: parseFloat(m.read) };
    });

    const categoryMapping: MeterCategoryMapping = Object.fromEntries(
        categories.map((item) => [item.id, { name: item.name, unit: item.unit }])
    );

    return (
        <ComponentStateHandler queries={[categoriesQuery, metersQuery]}>
            <AddMeter categories={categories} />
            <MetersList meters={meters_with_date} categoryMapping={categoryMapping} />
            <CategorySummary meters={meters_with_date} categoryMapping={categoryMapping} />
        </ComponentStateHandler>
    );
};

export default Meters;
