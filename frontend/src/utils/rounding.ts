export const round2 = (val: number): string => {
    return (Math.round(val * 100) / 100).toFixed(2);
};
