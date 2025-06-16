"use client";

import { Film, MapPin, Sparkles, TrendingUp } from "lucide-react";
import MovieSearch from "./MovieSearch";
import MovieFilter, { MovieStatus, MovieGenre } from "./MovieFilter";
import { movies } from "@/lib/data";
import MovieFilters from "./MovieFilter";
import MovieCard from "@/components/common/MovieCard";
import { useMemo, useState } from "react";

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MovieStatus>("all");
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre>("all");

  // Get all unique genres from movies
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach((movie) => {
      movie.movieType.forEach((genre) => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, []);

  // Filter movies based on search term, status, and genre
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.actor.some((actor) =>
          actor.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatus === "all" || movie.status === selectedStatus;

      const matchesGenre =
        selectedGenre === "all" || movie.movieType.includes(selectedGenre);

      return matchesSearch && matchesStatus && matchesGenre;
    });
  }, [searchTerm, selectedStatus, selectedGenre]);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br from-gray-900 via-gray to-black">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-12">
          <MovieSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {/* Results Counter */}
          <div className="mt-5 w-2/4 mx-auto text-center">
            <div className="bg-white dark:bg-black dark:border-gray-800 rounded-xl shadow border border-gray-100 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Showing{" "}
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {filteredMovies.length}
                    </span>
                    <span className="ml-1">
                      {filteredMovies.length === 1 ? "movie" : "movies"}
                    </span>
                    {searchTerm && (
                      <span className="ml-1">
                        for &quot;
                        <span className="font-semibold text-amber-600">
                          {searchTerm}
                        </span>
                        &quot;
                      </span>
                    )}
                  </p>
                </div>
                {filteredMovies.length > 0 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Results found!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Film className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No movies found
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn&apos;t find any movies matching your criteria. Try
                adjusting your search terms or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedGenre("all");
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
