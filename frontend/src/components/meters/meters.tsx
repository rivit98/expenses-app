import { useState } from 'react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { metersService } from '../../services/meters';
import { AddMeter } from './addMeter';
import { MetersList } from './metersList';
import { CategorySummary } from './categorySummary';
import { Meter, MeterCategory, MeterCategoryMapping, ParsedMeter } from '../../types/api';

const Meters = () => {
    const metersLoader = getAggregatedState<[MeterCategory[], Meter[]]>(
        metersService.getCategories,
        metersService.getMeters
    );
    const [refresher, setRefresher] = useState(0);
    const state = useAxiosEffect<[MeterCategory[], Meter[]]>(metersLoader, [refresher], [[], []]);
    const [categories, meters] = state.data;

    const meters_with_date: ParsedMeter[] = meters.map((m) => {
        return { ...m, date: new Date(m.date), read: parseFloat(m.read) };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping: MeterCategoryMapping = categories.reduce(
        (obj: MeterCategoryMapping, item) => ((obj[item.id] = { name: item.name, unit: item.unit }), obj),
        {}
    );

    const updateFunc = () => {
        setRefresher(refresher + 1);
    };

    return (
        <ComponentStateHandler state={state}>
            <AddMeter categories={categories} updateFunc={updateFunc} />
            <MetersList meters={meters_with_date} categoryMapping={categoryMapping} updateFunc={updateFunc} />
            <CategorySummary meters={meters_with_date} categoryMapping={categoryMapping} />
        </ComponentStateHandler>
    );
};

export default Meters;
