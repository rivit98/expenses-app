import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};

const calcAvgs = (summaryGroups, summaryGroupsToTake, categoryMapping) => {
    const categorySums = Object.keys(categoryMapping).reduce((obj, item) => ((obj[item] = 0), obj), {});

    const filtered_categories = summaryGroupsToTake.map((date) => summaryGroups[date]);

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
    // const categoryIDs = Object.keys(categoryMapping);
    const summaryGroupsToTake = Object.keys(summaryGroups).slice(0, 6).reverse();
    const datasets = Object.values(categoryMapping)
        .concat('Total')
        .map((cat) => {
            return {
                label: cat,
                data: [1, 2],
            };
        });
    calcAvgs(summaryGroups, summaryGroupsToTake, categoryMapping);

    const data = {
        labels: summaryGroupsToTake,
        datasets,
    };

    return <Line options={options} data={data} />;
};
