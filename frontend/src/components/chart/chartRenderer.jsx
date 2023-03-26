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
    options: {
        tooltip: {
            mode: 'nearest',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: false,
        },
    },
};
const MONTHS_TO_KEEP_ON_GRAPH = 12;

export const ChartRenderer = ({ summaryGroups, categoryMapping }) => {
    const summaryGroupsToTake = Object.fromEntries(
        Object.entries(summaryGroups).slice(0, MONTHS_TO_KEEP_ON_GRAPH).reverse()
    );

    const datasets = Object.entries(categoryMapping)
        .map(([catID, cat]) => {
            return {
                label: cat,
                data: Object.values(summaryGroupsToTake).map((g) => g[catID] || 0),
            };
        })
        .concat({
            label: 'Total',
            data: Object.values(summaryGroupsToTake).map((g) => Object.values(g).reduce((acc, x) => acc + x, 0)),
        });
    const data = {
        labels: Object.keys(summaryGroupsToTake),
        datasets,
    };

    return <Line options={options} data={data} />;
};
