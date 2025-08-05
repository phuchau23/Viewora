"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import ChartCard from "./ChartCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRevenue, useRevenueYears } from "@/hooks/useDashboard";

// Mapping tháng sang số
const monthMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const DashboardRevenueCharts = ({ branchId }: { branchId?: string }) => {
  const { t } = useTranslation();

  // --- Lấy danh sách năm có doanh thu ---
  const { data: availableYears, isLoading: isYearsLoading } = useRevenueYears();

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // --- Doanh thu theo tháng (trong năm) ---
  const { data: monthRevenueData, isLoading: isYearlyLoading } = useRevenue(
    selectedYear
      ? {
          Period: "Year",
          Year: Number(selectedYear),
          BranchId: branchId, // <== thêm vào đây
        }
      : undefined
  );

  // --- Tháng có doanh thu của năm được chọn ---
  const availableMonths = useMemo(() => {
    if (!monthRevenueData?.revenueData) return [];
    return monthRevenueData.revenueData.map((m) => m.label);
  }, [monthRevenueData]);

  // --- Doanh thu theo ngày (trong tháng) ---
  const { data: dayRevenueData, isLoading: isMonthlyLoading } = useRevenue(
    selectedMonth
      ? {
          Period: "Month",
          Year: Number(selectedYear),
          Month: monthMap[selectedMonth] ?? 0,
          BranchId: branchId, // <== thêm vào đây
        }
      : undefined
  );

  // --- Khi mở web: chọn năm và tháng hiện tại ---
  useEffect(() => {
    if (availableYears && availableYears.length > 0 && !selectedYear) {
      const currentYear = new Date().getFullYear().toString();
      const yearToSelect = availableYears.includes(currentYear)
        ? currentYear
        : availableYears[0];
      setSelectedYear(yearToSelect);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      const currentMonthNumber = new Date().getMonth() + 1; // 1 - 12
      const monthName = Object.keys(monthMap).find(
        (k) => monthMap[k] === currentMonthNumber
      );
      if (monthName && availableMonths.includes(monthName)) {
        setSelectedMonth(monthName);
      } else {
        setSelectedMonth(availableMonths[0]); // fallback
      }
    }
  }, [availableMonths, selectedMonth]);

  // --- Xử lý dữ liệu cột X ---
  const formattedMonthRevenueData = useMemo(() => {
    return (monthRevenueData?.revenueData ?? []).map((item) => ({
      ...item,
      label: monthMap[item.label] || item.label, // đổi từ "January" -> 1, ...
    }));
  }, [monthRevenueData]);

  const formattedDayRevenueData = useMemo(() => {
    return (dayRevenueData?.revenueData ?? []).map((item) => ({
      ...item,
      label: item.label.split("/")[0], // chỉ lấy ngày từ "04/07"
    }));
  }, [dayRevenueData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Biểu đồ theo tháng (trong năm) */}
      <ChartCard
        title={t("dash.yearRevenue")}
        icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
        isLoading={isYearlyLoading || isYearsLoading}
        action={
          <Select
            value={selectedYear}
            onValueChange={(val) => {
              setSelectedYear(val);
              setSelectedMonth(""); // reset tháng khi đổi năm
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {availableYears?.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedMonthRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" stroke="#666" />
            <YAxis stroke="#666" tick={{ fontSize: 15 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Biểu đồ theo ngày (trong tháng) */}
      <ChartCard
        title={t("dash.monthRevenue")}
        icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
        isLoading={isMonthlyLoading}
        action={
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
            disabled={!selectedYear}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedDayRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" stroke="#666" />
            <YAxis stroke="#666" tick={{ fontSize: 15 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default DashboardRevenueCharts;
