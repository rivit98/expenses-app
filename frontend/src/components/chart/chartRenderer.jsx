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
        tooltip: {
            callbacks: {
                label(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += `${context.parsed.y.toFixed(2)} zł`;
                    }
                    return label;
                },
            },
        },
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
    elements: {
        point: {
            radius: 4,
            hoverRadius: 6,
        },
    },
    scales: {
        x: {
            grid: {
                color: '#2e3033',
            },
        },
        y: {
            grid: {
                color: '#2e3033',
            },
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
