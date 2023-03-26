import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [1, 2, 3, 4, 5, 6, 7],
        },
        {
            label: 'Dataset 2',
            data: [7, 6, 5, 4, 3, 2, 1],
        },
    ],
};

const calcAvgs = (summaryGroups, categoryMapping) => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const today_str = `${month}-${year}`;
    const categorySums = Object.keys(categoryMapping).reduce((obj, item) => ((obj[item] = 0), obj), {});

    const filtered_categories = Object.keys(summaryGroups)
        .filter((date) => date !== today_str)
        .map((date) => summaryGroups[date]);

    filtered_categories.forEach((g) =>
        Object.entries(g).forEach(([k, v]) => {
            categorySums[k] += v;
        })
    );
    const total = Object.values(categorySums).reduce((acc, x) => acc + x, 0);
    const totalAvg = total / filtered_categories.length;

    return { categorySums, totalAvg };
};

export const ChartRenderer = ({ summaryGroups, categoryMapping }) => {
    const summaryGroupsObj = Object.fromEntries(summaryGroups);
    // const categoryIDs = Object.keys(categoryMapping);
    // const tableHeaders = ['Month'].concat(Object.values(categoryMapping)).concat('Total');
    calcAvgs(summaryGroupsObj, categoryMapping);

    return <Line options={options} data={data} />;
};
