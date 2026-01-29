import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BarChartTopMovies = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-4">🎬 Top phim doanh thu</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="title" />
          <YAxis
            width={80}
            tickFormatter={(value) => value.toLocaleString("vi-VN") + "đ"}
          />
          <Tooltip
            formatter={(value) => Number(value).toLocaleString("vi-VN") + "đ"}
          />
          <Bar dataKey="revenue" barSize={40} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartTopMovies;
