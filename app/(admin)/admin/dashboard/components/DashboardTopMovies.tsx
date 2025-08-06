"use client";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Sector,
  PieLabelRenderProps,
  SectorProps,
} from "recharts";
import ChartCard from "./ChartCard";
import { PieChart as PieChartIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActiveShape } from "recharts/types/util/types";

interface TopMovie {
  movieName: string;
  totalBookings: number;
}

const DashboardTopMovies: React.FC<{
  topMovies: TopMovie[];
  isLoading: boolean;
}> = ({ topMovies, isLoading }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const chartData = useMemo(
    () =>
      topMovies?.map((movie) => ({
        name: movie.movieName,
        value: movie.totalBookings,
      })) ?? [],
    [topMovies]
  );

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle = 0, innerRadius, outerRadius, percent } = props;
    const ir = Number(innerRadius ?? 0);
    const or = Number(outerRadius ?? 0);
    const radius = ir + (or - ir) * 0.5;
    const x = Number(cx ?? 0) + radius * Math.cos(-midAngle * RADIAN);
    const y = Number(cy ?? 0) + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {`${((percent ?? 0) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderActiveShape = (props: SectorProps & { midAngle?: number }) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, ...rest } = props;

    const RADIAN = Math.PI / 180;
    const offset = 12;
    const xOffset = Math.cos(-midAngle * RADIAN) * offset;
    const yOffset = Math.sin(-midAngle * RADIAN) * offset;

    return (
      <g
        style={{ transition: "transform 0.2s ease-out" }}
        transform={`translate(${xOffset}, ${yOffset})`}
      >
        <Sector {...rest} cx={cx} cy={cy} outerRadius={outerRadius + 5} />
      </g>
    );
  };
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "13px", // giảm font-size ở đây
            lineHeight: "1.4",
          }}
        >
          <div style={{ fontWeight: "normal" }}>{payload[0].name}</div>
          <div>{payload[0].value} vé</div>
        </div>
      );
    }
    return null;
  };

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
            paddingAngle={2}
            labelLine={false}
            label={renderCustomizedLabel}
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape} // <- Không lỗi any nữa
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="vertical"
            wrapperStyle={{
              fontSize: "14px",
              marginTop: "50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DashboardTopMovies;
