import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getLocalDateString(date) {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - offset * 60000);
    return d.toISOString().split("T")[0];
}

function ActivityChart() {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const habits = JSON.parse(localStorage.getItem("habits")) || [];
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

        const today = new Date();

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            return d;
        }).reverse();

        const labels = last7Days.map(day =>
            day.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );

        const habitCounts = last7Days.map(day => {
            const dayStr = getLocalDateString(day);
            return habits.filter(h => h.lastCompletedDate === dayStr).length;
        });

        const taskCounts = last7Days.map(day => {
            const dayStr = getLocalDateString(day);
            return completedTasks.filter(t => t.date === dayStr).length;
        });

        setChartData({
            labels,
            datasets: [
                {
                    label: "Habits Completed",
                    data: habitCounts,
                    backgroundColor: "rgba(54, 162, 235, 0.6)"
                },
                {
                    label: "Tasks Completed",
                    data: taskCounts,
                    backgroundColor: "rgba(255, 159, 64, 0.6)"
                }
            ]
        });
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: false }
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    callback: value => (Number.isInteger(value) ? value : null)
                },
                beginAtZero: true
            }
        }
    };

    return <Bar data={chartData} options={options} />;
}

export default ActivityChart;