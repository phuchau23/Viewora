"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMovies } from "@/hooks/useMovie";
import { useRouter } from "next/navigation";

// Format VND function (optional, include if price is added later)
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format duration function (replacing formatDuration from @/lib/data)
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export default function MoviesPage() {
  const [filter, setFilter] = useState<"all" | "nowShowing" | "inComing">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"latest" | "name" | "popularity">(
    "latest"
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Fetch movies using the useMovies hook
  const { movies, isLoading, isError, error } = useMovies();

  // Get all unique genres from movieTypes
  const allGenres = Array.from(
    new Set(
      movies.flatMap((movie) => movie.movieTypes.map((type) => type.name))
    )
  ).sort();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const router = useRouter();

  // Filter movies
  let filteredMovies = [...movies];

  if (filter !== "all") {
    filteredMovies = filteredMovies.filter((movie) => movie.status === filter);
  }

  if (selectedGenres.length > 0) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.movieTypes.some((type) => selectedGenres.includes(type.name))
    );
  }

  // Sort movies
  if (sortBy === "name") {
    filteredMovies.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "latest") {
    filteredMovies.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  // For "popularity", we would need a popularity field; using rate as a proxy
  else if (sortBy === "popularity") {
    filteredMovies.sort((a, b) => b.rate - a.rate);
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Movies</h1>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Movies
            </Button>
            <Button
              variant={filter === "nowShowing" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("nowShowing")}
            >
              Now Showing
            </Button>
            <Button
              variant={filter === "inComing" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("inComing")}
            >
              Coming Soon
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between pb-6 border-b">
          <div className="flex gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Genres
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {allGenres.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                  >
                    {genre}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedGenres.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenres([])}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select
              defaultValue="latest"
              value={sortBy}
              onValueChange={(value) => setSortBy(value as any)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">
              Error loading movies: {error?.message || "Unknown error"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <Card
                onClick={() => router.push(`/movies/${movie.id}`)}
                key={movie.id}
                className="overflow-hidden group"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={movie.poster || "/fallback-poster.jpg"}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex gap-2 mb-2">
                        {movie.status === "nowShowing" ? (
                          <Button size="sm" asChild>
                            <Link href={`/booking/${movie.id}`}>
                              Buy Tickets
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Coming Soon
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={movie.trailerUrl}>
                            <Play className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {movie.status === "inComing" && (
                    <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate mb-1">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="hover:text-primary"
                    >
                      {movie.name}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {movie.movieTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDuration(movie.duration)}</span>
                    <span>•</span>
                    <span>
                      {new Date(movie.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No movies found matching your filters.
            </p>
            <Button
              onClick={() => {
                setFilter("all");
                setSelectedGenres([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
