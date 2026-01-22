import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ values }) {
  const colors = [
    "rgba(239, 68, 68, .7)", // red-500
    "rgba(150, 75, 0, .7)", // brown
    "rgba(59, 130, 246, .7)", // blue-500
    "rgba(16, 185, 129, .7)", // green-500
    "rgba(245, 158, 11, .7)", // yellow-500
    "rgba(139, 92, 246, .7)", // purple-500
  ];

  const data = {
    labels: ["Uploaded", "Drafted", "Sended", "Signed", "Inbox", "Completed"],
    datasets: [
      {
        label: "Documents",
        data: [
          values.uploaded ?? 0,
          values.saved ?? 0,
          values.sended ?? 0,
          values.signed ?? 0,
          values.inbox ?? 0,
          values.complete ?? 0,
        ],
        borderColor: "#d3dceb",
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 1, // only whole numbers
          precision: 0, // no decimals
        },
        beginAtZero: true,
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="w-full h-96 bg-background rounded shadow p-4">
      <Bar data={data} options={options} />
    </div>
  );
}
