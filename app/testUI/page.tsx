"use client";

import { useState } from "react";

const showtimesByDate: Record<string, string[]> = {
  "2025-06-12": ["10:00", "13:00", "17:30"],
  "2025-06-13": [],
  "2025-06-14": ["09:00", "21:00"],
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }); // ví dụ: "Th 5, 12/06"
};

export default function ShowtimeSelector() {
  const dateKeys = Object.keys(showtimesByDate);
  const [selectedDate, setSelectedDate] = useState<string>(dateKeys[0]);

  const showtimes = showtimesByDate[selectedDate] || [];

  return (
    <div className="space-y-4">
      {/* Dãy nút chọn ngày */}
      <div className="flex gap-2 overflow-x-auto">
        {dateKeys.map((dateStr) => (
          <button
            key={dateStr}
            onClick={() => setSelectedDate(dateStr)}
            className={`px-4 py-2 rounded border ${
              selectedDate === dateStr
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {formatDate(dateStr)}
          </button>
        ))}
      </div>

      {/* Kết quả suất chiếu */}
      <div className="min-h-[100px] border rounded p-4 bg-gray-50">
        {showtimes.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {showtimes.map((time) => (
              <div
                key={time}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {time}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Hiện tại không có suất chiếu cho ngày này.
          </p>
        )}
      </div>
    </div>
  );
}
