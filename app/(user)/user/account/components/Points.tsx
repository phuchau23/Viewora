"use client";

import { useState } from "react";
import { ProfileDataResponse, ScoreRecord } from "@/lib/api/service/fetchUser";
import { useScoreHistory } from "@/hooks/useUsers";

interface PointsProps {
  user: ProfileDataResponse;
}
export default function Points({ user }: PointsProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [historyType, setHistoryType] = useState<"added" | "used" | "all">(
    "all"
  );
  const [filteredRecords, setFilteredRecords] = useState<ScoreRecord[]>([]);

  // Fetch score history using the hook
  const { data, isLoading, isError, error } = useScoreHistory({
    FromDate: fromDate ? fromDate.split("/").reverse().join("-") : undefined,
    ToDate: toDate ? toDate.split("/").reverse().join("-") : undefined,
    ActionType: historyType !== "all" ? historyType : undefined,
  });

  const handleViewScore = () => {
    let records = data?.records || [];

    if (fromDate && toDate) {
      records = records.filter((record) => {
        const recordDate = new Date(
          record.dateCreated.split("/").reverse().join("-")
        );
        const from = new Date(fromDate.split("/").reverse().join("-"));
        const to = new Date(toDate.split("/").reverse().join("-"));
        return recordDate >= from && recordDate <= to;
      });
    }

    if (historyType !== "all") {
      records = records.filter((record) => record.type === historyType);
    }

    setFilteredRecords(records);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setHistoryType("all");
    setFilteredRecords(data?.records || []);
  };

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Balance Section */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-xl text-white flex justify-between items-center">
          <div>
            <div className="text-lg font-semibold">Total Score</div>
            <div className="mt-2 text-3xl font-bold drop-shadow-md">
              {user.rewardPoint || 150} {/* Use user.rewardPoint from props */}
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8 border border-orange-200 dark:border-orange-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">
                From
              </label>
              <input
                type="date"
                value={formatDateForInput(fromDate)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  setFromDate(`${day}/${month}/${year}`);
                }}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">
                To
              </label>
              <input
                type="date"
                value={formatDateForInput(toDate)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  setToDate(`${day}/${month}/${year}`);
                }}
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleViewScore}
                className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:opacity-90 text-white font-medium py-2 rounded-lg transition-all"
              >
                Filter
              </button>
              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="flex gap-4">
            {["all", "added", "used"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="historyType"
                  checked={historyType === type}
                  onChange={() => setHistoryType(type as any)}
                  className="accent-orange-500"
                />
                <span className="text-sm dark:text-white capitalize">
                  {type === "all"
                    ? "All"
                    : type === "added"
                    ? "Score Added"
                    : "Score Used"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Timeline History */}
        <div className="relative border-l-2 border-orange-500 pl-6 space-y-8">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Loading score history...
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-red-500 dark:text-red-400">
              Error loading score history: {error?.message || "Unknown error"}
            </div>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[10px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-500 dark:border-orange-400"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-semibold text-orange-600 dark:text-orange-300">
                      {record.movieName}
                    </div>
                    <div
                      className={`font-bold text-sm ${
                        record.type === "added"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {record.type === "added"
                        ? `+${record.score}`
                        : `-${record.score}`}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {record.dateCreated}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {data?.message ||
                "No score history found for the selected period."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
