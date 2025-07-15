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

// Responsive time slot generator
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour <= 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Interface for showtime with layout information
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

  // Sort showtimes by start time
  const sortedShowtimes = [...showtimes].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const layoutShowtimes: ShowtimeWithLayout[] = [];

  for (let i = 0; i < sortedShowtimes.length; i++) {
    const currentShowtime = sortedShowtimes[i];

    // Find all showtimes that overlap with the current one
    const overlappingShowtimes = sortedShowtimes.filter((showtime) =>
      doTimesOverlap(
        currentShowtime.startTime,
        currentShowtime.endTime,
        showtime.startTime,
        showtime.endTime
      )
    );

    // Find available column for this showtime
    let column = 0;
    const usedColumns = new Set<number>();

    // Check which columns are already used by overlapping showtimes
    for (const overlapping of overlappingShowtimes) {
      const existingLayout = layoutShowtimes.find(
        (ls) => ls.id === overlapping.id
      );
      if (existingLayout) {
        usedColumns.add(existingLayout.layoutColumn);
      }
    }

    // Find the first available column
    while (usedColumns.has(column)) {
      column++;
    }

    // Calculate total columns needed for this group
    const totalColumns = Math.max(overlappingShowtimes.length, column + 1);

    // Update total columns for all overlapping showtimes
    overlappingShowtimes.forEach((overlapping) => {
      const existingIndex = layoutShowtimes.findIndex(
        (ls) => ls.id === overlapping.id
      );
      if (existingIndex !== -1) {
        layoutShowtimes[existingIndex].totalColumns = Math.max(
          layoutShowtimes[existingIndex].totalColumns,
          totalColumns
        );
      }
    });

    layoutShowtimes.push({
      ...currentShowtime,
      layoutColumn: column,
      totalColumns: totalColumns,
    });
  }

  return layoutShowtimes;
};

const AdminShowtimePage: React.FC = () => {
  const { showTime } = useShowTime();
  console.log(showTime);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Find the earliest movie start date
    const earliestDate = showTime.reduce((earliest, showtime) => {
      const showtimeDate = new Date(showtime.startTime);
      return showtimeDate < earliest ? showtimeDate : earliest;
    }, new Date(showTime[0]?.startTime || new Date()));
    // Set to start of week (Sunday)
    const startOfWeek = new Date(earliestDate);
    startOfWeek.setDate(earliestDate.getDate() - earliestDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  // Generate week dates starting from currentWeekStart
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 4; i++) {
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
      currentWeekStart.getDate() + (direction === "next" ? 4 : -4)
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
    const targetDate = date.toISOString().split("T")[0];
    return showTime.filter((showtime) => {
      const showtimeDate = new Date(showtime.startTime);
      const showtimeDateStr = showtimeDate.toISOString().split("T")[0];
      return showtimeDateStr === targetDate;
    });
  };

  const calculatePosition = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();

    // Each hour is 48px (h-12 in Tailwind), so 1 minute = 48/60 = 0.8px
    const startOffset = startHour * 60 + startMinute; // Total minutes from 00:00
    const endOffset = endHour * 60 + endMinute; // Total minutes from 00:00
    const top = (startOffset / 60) * 48; // Position from top
    const height = Math.max(((endOffset - startOffset) / 60) * 48, 30); // Minimum height 30px

    return { top, height };
  };

  // Calculate layout position for overlapping showtimes
  const calculateLayoutPosition = (
    showtime: ShowtimeWithLayout,
    containerWidth = 100
  ) => {
    // Set minimum width for each showtime block (at least 120px equivalent)
    const minWidthPercent = Math.max(
      25,
      100 / Math.max(showtime.totalColumns, 4)
    );
    const columnWidth = Math.max(
      minWidthPercent,
      containerWidth / showtime.totalColumns
    );
    const leftOffset =
      showtime.layoutColumn * (containerWidth / showtime.totalColumns);

    return {
      width: `${Math.min(columnWidth - 1, 95)}%`, // Ensure minimum spacing but max 95%
      left: `${leftOffset}%`,
      minWidth: "80px", // Absolute minimum width
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

  return (
    <div className="min-h-screen bg-background p-2 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                Movie Showtime Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage cinema showtimes and schedules
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="text-white" size={20} />
              <span className="hidden sm:inline text-white">Add Showtime</span>
              <span className="sm:hidden text-white">Add</span>
            </Button>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-background rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
          <div className="bg-background px-2 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                <Calendar className="text-foreground" size={24} />
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Weekly Schedule
                </h2>
              </div>
              <div className="flex items-center">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  Total Showtimes :{" "}
                  <strong className="text-foreground font-bold">
                    {showTime.length}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-4">
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={20} />
                  <span className="text-sm font-medium hidden sm:inline">
                    Previous
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
                    Next
                  </span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-fit">
              {" "}
              {/* Changed from min-w-[auto] to min-w-fit */}
              {/* Days Header */}
              <div
                className="grid border-b border-gray-200 dark:border-gray-600 text-xs sm:text-base"
                style={{
                  gridTemplateColumns: `120px repeat(4, minmax(200px, 1fr))`,
                }}
              >
                <div className="p-1 sm:p-3 bg-background font-medium text-foreground text-center border-r border-gray-200 dark:border-gray-600">
                  Time
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
                      style={{
                        minWidth: `${Math.max(150, maxOverlaps * 80)}px`,
                      }}
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
                            Today
                          </span>
                        )}
                      </div>
                      {maxOverlaps > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {maxOverlaps} phim đang chiếu
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Time Grid Container */}
              <div className="relative">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `120px repeat(4, minmax(200px, 1fr))`,
                  }}
                >
                  {/* Time Column */}
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

                  {/* Day Columns */}
                  {weekDates.map((date, dateIndex) => {
                    const dayShowtimes = getShowtimesForDate(date);
                    const layoutShowtimes =
                      calculateShowtimeLayout(dayShowtimes);

                    // Calculate if this day needs extra width due to overlaps
                    const maxOverlaps = Math.max(
                      ...layoutShowtimes.map((s) => s.totalColumns),
                      1
                    );
                    const needsExtraWidth = maxOverlaps > 2;

                    return (
                      <div
                        key={dateIndex}
                        className={`relative border-r border-gray-200 dark:border-gray-600 last:border-r-0 ${
                          needsExtraWidth ? "min-w-[250px]" : "min-w-[180px]"
                        } ${
                          isPast(date)
                            ? "bg-background/30 dark:bg-background/30"
                            : ""
                        }`}
                        style={{
                          width: needsExtraWidth
                            ? `${Math.max(200, maxOverlaps * 80)}px`
                            : "auto",
                        }}
                      >
                        {/* Time slot backgrounds */}
                        {timeSlots.map((timeSlot) => (
                          <div
                            key={timeSlot}
                            className="h-8 sm:h-12 border-b border-gray-200 dark:border-gray-600 hover:bg-background transition-colors"
                          ></div>
                        ))}

                        {/* Showtime blocks with layout */}
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
                                height: `${Math.max(height, 40)}px`, // Minimum height 40px
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
                                    Room {showtime.room.roomNumber}
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

      {/* Showtime Detail Modal */}
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
              Add Showtime
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
