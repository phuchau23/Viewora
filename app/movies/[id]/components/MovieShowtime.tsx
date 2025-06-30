"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import { useShowTimeByMovieId } from "@/hooks/useShowTime";
import RoomSeatingChart from "./seatChart";

interface MovieShowtimeProps {
  movieId: string;
}

const MovieShowtime: React.FC<MovieShowtimeProps> = ({ movieId }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);

  const {
    showTime,
    isLoading,
    error: showTimeError,
  } = useShowTimeByMovieId(movieId);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 9; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayNames = [
        "CN",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      const dayName = i === 0 ? "Hôm nay" : dayNames[date.getDay()];
      dates.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        dayName,
        isToday: i === 0,
      });
    }
    return dates;
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`;
  };

  const dates = generateDates();

  const uniqueBranches = Array.isArray(showTime)
    ? Array.from(
        new Map(
          showTime.map((item) => [item.room.branch.id, item.room.branch])
        ).values()
      )
    : [];

  const filteredShowTimes = Array.isArray(showTime)
    ? showTime.filter((item) => {
        const itemDateString = new Date(item.startTime)
          .toISOString()
          .split("T")[0];
        return (
          itemDateString === selectedDate &&
          item.room.branch.id === selectedBranch
        );
      })
    : [];

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center rounded-xl shadow-md bg-card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            Đang tải lịch chiếu...
          </p>
        </div>
      </div>
    );
  }

  if (showTimeError) {
    return (
      <div className="min-h-[300px] flex items-center justify-center rounded-xl shadow-md bg-card p-6">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <h2 className="text-md font-semibold text-foreground mb-1">
            Có lỗi xảy ra
          </h2>
          <p className="text-muted-foreground text-sm mb-3">
            {showTimeError.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[auto] bg-background border border-border">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          Lịch chiếu phim
        </h1>

        {/* Date Selector */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-muted rounded-full shrink-0">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="scrollbar-hide px-2">
            <div className="flex w-max gap-2">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => {
                    setSelectedDate(d.date);
                    setExpandedShowId(null);
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl min-w-[70px] text-center text-sm font-medium transition-all ${
                    selectedDate === d.date
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="text-lg font-semibold">{d.day}</div>
                  <div>{d.dayName}</div>
                </button>
              ))}
            </div>
          </div>

          <button className="p-2 hover:bg-muted rounded-full shrink-0">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Branch Selector */}
        <div className="flex gap-3 mb-6">
          {uniqueBranches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => {
                setSelectedBranch(branch.id);
                setExpandedShowId(null);
              }}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl min-w-[80px] border transition-all ${
                selectedBranch === branch.id
                  ? "bg-orange-100 dark:bg-orange-900 border-orange-500 scale-105"
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                {branch.name[0]}
              </div>
              <span className="text-xs mt-2 text-foreground text-center">
                {branch.name}
              </span>
            </button>
          ))}
        </div>

        {/* Showtime Cards */}
        {Object.entries(
          filteredShowTimes.reduce<Record<string, typeof filteredShowTimes>>(
            (acc, show) => {
              const groupKey = `${show.movie.movieType?.name}-${show.room.id}`;
              if (!acc[groupKey]) acc[groupKey] = [];
              acc[groupKey].push(show);
              return acc;
            },
            {}
          )
        ).map(([key, shows]) => {
          const [roomType] = key.split("-");
          const firstShow = shows[0];
          return (
            <div
              key={key}
              className="mb-6 p-4 rounded-xl shadow-sm border border-border bg-card"
            >
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold text-lg text-foreground">
                  {firstShow.movie.name} – Phòng {firstShow.room.roomNumber} (
                  {roomType})
                </h2>
                <div className="flex items-center text-yellow-500 gap-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {firstShow.movie.rate}/5
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(firstShow.movie.duration)}</span>
                <span className="px-2 py-0.5 text-xs rounded bg-muted">
                  {firstShow.movie.age}
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {firstShow.movie.movieType?.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {firstShow.movie.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {shows.map((show) => (
                  <div key={show.id}>
                    <div className="text-xs font-bold text-foreground">
                      {show.room.roomType.name}
                    </div>
                    <button
                      onClick={() =>
                        setExpandedShowId((prev) =>
                          prev === show.id ? null : show.id
                        )
                      }
                      className={`px-4 py-2 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 text-sm transition hover:scale-105 ${
                        expandedShowId === show.id
                          ? "ring-2 ring-primary/50"
                          : ""
                      }`}
                    >
                      {formatTime(show.startTime)} - {formatTime(show.endTime)}
                    </button>
                  </div>
                ))}
              </div>

              {shows.map(
                (show) =>
                  expandedShowId === show.id && (
                    <div key={show.id} className="mt-4 border-t pt-4">
                      <RoomSeatingChart
                        roomId={show.room.id}
                        movie={show.movie}
                        showtime={formatTime(show.startTime)}
                        roomNumber={show.room.roomNumber}
                        branchName={show.room.branch.name}
                      />
                    </div>
                  )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovieShowtime;
