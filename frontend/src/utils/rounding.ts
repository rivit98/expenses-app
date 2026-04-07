import { texts } from '../constants/texts';

export const round2 = (val: number): string => {
    return (Math.round(val * 100) / 100).toFixed(2);
};

export const formatCurrency = (value: number): string => `${round2(value)} ${texts.common.currency}`;
