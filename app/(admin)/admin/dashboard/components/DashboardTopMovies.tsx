"use client";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "./ChartCard";
import { PieChart as PieChartIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const DashboardTopMovies: React.FC<{
  topMovies: any[];
  isLoading: boolean;
}> = ({ topMovies, isLoading }) => {
  const { t } = useTranslation();

  // Chuẩn hóa dữ liệu
  const chartData = useMemo(
    () =>
      topMovies?.map((movie) => ({
        name: movie.movieName,
        value: movie.totalBookings,
      })) ?? [],
    [topMovies]
  );

  // Màu sắc cho top 5
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <ChartCard
      title={t("dash.topSellingMovies")}
      icon={<PieChartIcon className="h-5 w-5 text-orange-500" />}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            labelLine
            label={({ cx, cy, midAngle, outerRadius, name, value, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius + 25;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill={COLORS[index % COLORS.length]}
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={12}
                >
                  {`${name} (${value})`}
                </text>
              );
            }}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "15px", marginTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DashboardTopMovies;
