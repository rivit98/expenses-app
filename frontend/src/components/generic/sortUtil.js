export const byDate = (t1, t2) => {
    return t2.getTime() - t1.getTime();
};

export const byNumber = (t1, t2) => {
    return t1 - t2;
};

export const reverse = (res) => {
    return -res;
};
