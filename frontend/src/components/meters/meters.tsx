import { useMeterCategories, useMeters } from '../../hooks/queries';
import { ComponentStateHandler } from '../generic/componentStateHandler';
import { AddMeter } from './addMeter';
import { MetersList } from './metersList';
import { CategorySummary } from './categorySummary';
import { MeterCategoryMapping, ParsedMeter } from '../../types/api';

const Meters = () => {
    const categoriesQuery = useMeterCategories();
    const metersQuery = useMeters();

    const categories = categoriesQuery.data ?? [];
    const meters = metersQuery.data ?? [];

    const meters_with_date: ParsedMeter[] = meters.map((m) => {
        return { ...m, date: new Date(m.date), read: parseFloat(m.read) };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping: MeterCategoryMapping = categories.reduce(
        (obj: MeterCategoryMapping, item) => ((obj[item.id] = { name: item.name, unit: item.unit }), obj),
        {}
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
