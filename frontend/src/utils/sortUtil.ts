export const byDate = (t1: Date, t2: Date): number => {
    return t2.getTime() - t1.getTime();
};

export const byNumber = (t1: number, t2: number): number => {
    return t1 - t2;
};

export const reverse = (res: number): number => {
    return -res;
};
