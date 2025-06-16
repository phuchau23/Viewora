import React from "react";
import { Filter, Sparkles, Calendar, Film } from "lucide-react";

export type MovieStatus = "all" | "nowShowing" | "inComing";
export type MovieGenre = "all" | string;

interface MovieFiltersProps {
  selectedStatus: MovieStatus;
  selectedGenre: MovieGenre;
  onStatusChange: (status: MovieStatus) => void;
  onGenreChange: (genre: MovieGenre) => void;
  availableGenres: string[];
}

export default function MovieFilters({
  selectedStatus,
  selectedGenre,
  onStatusChange,
  onGenreChange,
  availableGenres,
}: MovieFiltersProps) {
  const statusOptions = [
    {
      value: "all" as const,
      label: "All Movies",
      icon: Film,
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "from-purple-600 to-pink-600",
    },
    {
      value: "nowShowing" as const,
      label: "Now Showing",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-500",
      hoverGradient: "from-green-600 to-emerald-600",
    },
    {
      value: "inComing" as const,
      label: "Coming Soon",
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-500",
      hoverGradient: "from-blue-600 to-indigo-600",
    },
  ];

  const genreOptions = [
    { value: "all", label: "All Genres" },
    ...availableGenres.map((genre) => ({ value: genre, label: genre })),
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-2xl shadow-lg">
          <Filter className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 ml-4">Filter Movies</h2>
      </div>

      <div className="space-y-8">
        {/* Status Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3"></div>
            Movie Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedStatus === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${option.gradient} text-white shadow-2xl`
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <IconComponent
                      className={`w-8 h-8 ${
                        isSelected ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-sm">
                      {option.label}
                    </span>
                  </div>

                  {/* Animated background for hover effect */}
                  {!isSelected && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Genre Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
            Movie Genre
          </h3>
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="w-full md:w-auto min-w-[300px] px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer appearance-none"
            >
              {genreOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="py-2"
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-600"></div>
            </div>

            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedStatus !== "all" || selectedGenre !== "all") && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center flex-wrap gap-3">
            <span className="text-sm font-medium text-gray-600">
              Active Filters:
            </span>
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
                {
                  statusOptions.find((opt) => opt.value === selectedStatus)
                    ?.label
                }
              </span>
            )}
            {selectedGenre !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
                {selectedGenre}
              </span>
            )}
            <button
              onClick={() => {
                onStatusChange("all");
                onGenreChange("all");
              }}
              className="text-xs text-gray-500 hover:text-red-500 underline transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
