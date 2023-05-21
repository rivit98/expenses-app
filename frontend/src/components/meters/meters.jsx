import { useState } from 'react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { metersService } from '../../services/meters';
import { AddMeter } from './addMeter';
import { MetersList } from './metersList';
import { CategorySummary } from './categorySummary';

const Meters = () => {
    const metersLoader = getAggregatedState(metersService.getCategories, metersService.getMeters);
    const [refresher, setRefresher] = useState(0);
    const state = useAxiosEffect(metersLoader, [refresher], [[], []]);
    const [categories, meters] = state.data;

    console.log(meters);
    const meters_with_date = meters.map((m) => {
        return { ...m, date: new Date(m.date), read: parseFloat(m.read) };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping = categories.reduce(
        (obj, item) => ((obj[item.id] = { name: item.name, unit: item.unit }), obj),
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
