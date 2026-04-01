import dateformat from 'dateformat';

const formatDate = (date: Date | string | number, format = 'dd.mm.yyyy'): string => {
    return dateformat(date, format);
};

export default formatDate;
