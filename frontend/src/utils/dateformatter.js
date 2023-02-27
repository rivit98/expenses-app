import dateformat from 'dateformat';

const formatDate = (date, format = 'dd.mm.yyyy') => {
    return dateformat(date, format);
};

export default formatDate;
