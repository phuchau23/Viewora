"use client";
import type React from "react";
import { useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useShowTime } from "@/hooks/useShowTime";
import { Button } from "@/components/ui/button";
import CreateShowtimeForm from "./components/CreateShowtimeForm";
import { ShowtimeDetailModal } from "./components/ShowtimeDetail";
import BranchFilter from "./components/BranchFilter";
import { useTranslation } from "react-i18next";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 26; hour++) {
    const displayHour = hour % 24;
    const paddedHour = displayHour.toString().padStart(2, "0");
    slots.push(`${paddedHour}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface ShowtimeWithLayout {
  id: string;
  startTime: string;
  endTime: string;
  movie: { name: string };
  room: { roomNumber: string; roomType?: { name?: string } };
  layoutColumn: number;
  totalColumns: number;
}

// Function to check if two time ranges overlap
const doTimesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  return s1 < e2 && s2 < e1;
};

// Function to calculate layout for overlapping showtimes
const calculateShowtimeLayout = (showtimes: any[]): ShowtimeWithLayout[] => {
  if (showtimes.length === 0) return [];

  const sorted = [...showtimes].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const positioned: ShowtimeWithLayout[] = [];
  let group: any[] = [];
  let latestEndTime = 0;

  const flushGroup = () => {
    if (group.length === 0) return;
    const columns: ShowtimeWithLayout[][] = [];

    for (const show of group) {
      const showStart = new Date(show.startTime).getTime();
      const showEnd = new Date(show.endTime).getTime();
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const hasOverlap = col.some((other) => {
          const s2 = new Date(other.startTime).getTime();
          const e2 = new Date(other.endTime).getTime();
          return showStart < e2 && s2 < showEnd;
        });
        if (!hasOverlap) {
          col.push(show);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([show]);
      }
    }

    const totalCols = columns.length;
    columns.forEach((col, colIndex) => {
      col.forEach((s) => {
        positioned.push({
          ...s,
          layoutColumn: totalCols === 1 ? 0 : colIndex,
          totalColumns: totalCols,
        });
      });
    });
    group = [];
  };

  for (const show of sorted) {
    const start = new Date(show.startTime).getTime();
    if (start >= latestEndTime) {
      flushGroup(); // finish previous overlap group
    }

    group.push(show);
    const end = new Date(show.endTime).getTime();
    latestEndTime = Math.max(latestEndTime, end);
  }
  flushGroup();
  return positioned;
};

const AdminShowtimePage: React.FC = () => {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Move back to Monday
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const startDateStr = currentWeekStart.toDateString();
  const endDate = new Date(currentWeekStart);
  endDate.setDate(endDate.getDate() + 8); // Kết thúc sau 7 ngày
  const endDateStr = endDate.toDateString();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { showTime } = useShowTime(startDateStr, endDateStr);

  const getRoomTypeColor = (roomType?: { name?: string }) => {
    switch (roomType?.name) {
      case "IMAX":
        return "bg-purple-500";
      case "2D":
        return "bg-red-500";
      case "3D":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const weekDates = getWeekDates();

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeekStart(newWeekStart);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getShowtimesForDate = (date: Date) => {
    const targetDate = date.toDateString();
    return showTime
      .filter((showtime) => {
        const showtimeDate = new Date(showtime.startTime);
        return showtimeDate.toDateString() === targetDate;
      })
      .filter((showtime) => {
        if (!selectedBranch) return true;
        return showtime.room.branch.name === selectedBranch;
      });
  };

  const gridTemplateColumns = `120px repeat(${weekDates.length}, minmax(150px, 1fr))`;
  const calculatePosition = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startOffset = start.getHours() * 60 + start.getMinutes();
    let endOffset = end.getHours() * 60 + end.getMinutes();

    // Nếu kết thúc vào hôm sau, cộng thêm 24h
    if (end.getDate() !== start.getDate()) {
      endOffset += 24 * 60;
    }

    // Trừ 8 tiếng (480 phút) vì 08:00 là mốc top = 0
    const top = ((startOffset - 480) / 60) * 48;
    const height = Math.max(((endOffset - startOffset) / 60) * 48, 30);
    return { top, height };
  };
  const calculateLayoutPosition = (showtime: ShowtimeWithLayout) => {
    const total = showtime.totalColumns;
    const index = showtime.layoutColumn;
    const columnWidth = 100 / total; // đảm bảo không vượt quá 100%
    const leftOffset = index * columnWidth;
    return {
      width: `${columnWidth}%`,
      left: `${leftOffset}%`,
      minWidth: "60px",
    };
  };

  const handleShowtimeClick = (showtime: any) => {
    setSelectedShowtime(showtime);
    setIsDetailModalOpen(true);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max px-2 sm:px-6">
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                {t("adminshowtime.title")}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {t("adminshowtime.description")}
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="text-white" size={20} />
              <span className="hidden sm:inline text-white">
                {t("adminshowtime.addShowtime")}
              </span>
              <span className="sm:hidden text-white">
                {t("adminshowtime.add")}
              </span>
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
          <div className="bg-background px-2 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                <Calendar className="text-foreground" size={24} />
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {t("adminshowtime.weeklySchedule")}
                </h2>
              </div>
              <div className="flex items-center">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {t("adminshowtime.totalShowtimes")}{" "}
                  <strong className="text-foreground font-bold">
                    {showTime.length}
                  </strong>
                </p>
              </div>
              <BranchFilter
                branches={Array.from(
                  new Set(showTime.map((s) => s.room.branch.name))
                )}
                selectedBranch={selectedBranch}
                onChange={setSelectedBranch}
              />
              <div className="flex items-center gap-1 sm:gap-4">
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={20} />
                  <span className="text-sm font-medium hidden sm:inline">
                    {t("adminshowtime.previous")}
                  </span>
                </button>
                <div className="text-center px-1">
                  <div className="text-base sm:text-lg font-semibold text-foreground">
                    {currentWeekStart.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs sm:text-sm text-foreground">
                    {formatDate(weekDates[0])} - {formatDate(weekDates[3])}
                  </div>
                </div>
                <button
                  onClick={() => navigateWeek("next")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="text-sm font-medium hidden sm:inline">
                    {t("adminshowtime.next")}
                  </span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="w-full">
              <div
                className="grid w-full border-b border-gray-200 dark:border-gray-600 text-xs sm:text-base"
                style={{ gridTemplateColumns }}
              >
                <div className="w-[120px] p-1 sm:p-3 bg-background font-medium text-foreground text-center border-r border-gray-200 dark:border-gray-600 shrink-0">
                  {t("adminshowtime.time")}
                </div>
                {weekDates.map((date, index) => {
                  const dayShowtimes = getShowtimesForDate(date);
                  const layoutShowtimes = calculateShowtimeLayout(dayShowtimes);
                  const maxOverlaps = Math.max(
                    ...layoutShowtimes.map((s) => s.totalColumns),
                    1
                  );
                  return (
                    <div
                      key={index}
                      className={`p-1 sm:p-3 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0 ${
                        isToday(date)
                          ? "bg-blue-50"
                          : isPast(date)
                          ? "bg-background"
                          : "bg-background"
                      }`}
                    >
                      <div
                        className={`font-semibold ${
                          isToday(date) ? "text-blue-900" : "text-foreground"
                        }`}
                      >
                        {formatDate(date)}
                      </div>
                      <div
                        className={`text-xs sm:text-sm ${
                          isToday(date) ? "text-blue-600" : "text-foreground"
                        }`}
                      >
                        {getDayName(date)}
                        {isToday(date) && (
                          <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">
                            {t("adminshowtime.today")}
                          </span>
                        )}
                      </div>
                      {maxOverlaps > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {t("adminshowtime.moviesShowing", {
                            count: maxOverlaps,
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Time Grid Container */}
              <div className="relative">
                <div className="grid" style={{ gridTemplateColumns }}>
                  <div className="border-r border-gray-200 dark:border-gray-600">
                    {timeSlots.map((timeSlot) => (
                      <div
                        key={timeSlot}
                        className="h-8 sm:h-12 border-b border-gray-200 dark:border-gray-600 bg-background flex items-center justify-center"
                      >
                        <div className="text-xs font-medium text-foreground flex items-center justify-center gap-1 w-full">
                          <Clock size={12} />
                          {timeSlot}
                        </div>
                      </div>
                    ))}
                  </div>

                  {weekDates.map((date, dateIndex) => {
                    const dayShowtimes = getShowtimesForDate(date);
                    const layoutShowtimes =
                      calculateShowtimeLayout(dayShowtimes);

                    return (
                      <div
                        key={dateIndex}
                        className="relative border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                      >
                        {timeSlots.map((timeSlot) => (
                          <div
                            key={timeSlot}
                            className="h-8 sm:h-12 border-b border-gray-200 dark:border-gray-600 hover:bg-background transition-colors"
                          ></div>
                        ))}
                        {layoutShowtimes.map((showtime) => {
                          const { top, height } = calculatePosition(
                            showtime.startTime,
                            showtime.endTime
                          );
                          const layoutPosition =
                            calculateLayoutPosition(showtime);

                          return (
                            <div
                              key={showtime.id}
                              className={`absolute ${getRoomTypeColor(
                                showtime.room.roomType
                              )} text-white rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all transform hover:scale-[1.02] z-10 border border-white/20 ${
                                isPast(date) ? "opacity-20" : ""
                              }`}
                              style={{
                                top: `${top}px`,
                                height: `${Math.max(height, 40)}px`,
                                width: layoutPosition.width,
                                left: layoutPosition.left,
                                minWidth: layoutPosition.minWidth,
                              }}
                              onClick={() => handleShowtimeClick(showtime)}
                            >
                              <div className="p-1 sm:p-2 h-full flex flex-col justify-between overflow-hidden">
                                <div>
                                  <div className="font-semibold text-xs sm:text-sm truncate mb-1 leading-tight">
                                    {showtime.movie.name}
                                  </div>
                                  <div className="text-xs opacity-90 truncate">
                                    {t("adminshowtime.room")}{" "}
                                    {showtime.room.roomNumber}
                                  </div>
                                </div>
                                <div className="text-xs opacity-90 truncate font-medium">
                                  {formatTime(showtime.startTime)} -{" "}
                                  {formatTime(showtime.endTime)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShowtimeDetailModal
        showtime={selectedShowtime}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedShowtime(null);
        }}
      />

      {isCreateModalOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("adminshowtime.addShowtime")}
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <CreateShowtimeForm onSuccess={() => setIsCreateModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShowtimePage;
