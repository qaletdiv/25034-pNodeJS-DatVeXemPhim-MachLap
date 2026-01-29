import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ chartData }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => Number(value).toLocaleString("vi-VN") + "đ"}
          />
          <Line dataKey="total" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
