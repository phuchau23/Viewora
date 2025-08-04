// app/(user)/user/movies/[id]/components/MovieDetailWrapper.tsx
"use client";

import React from "react";
import { notFound } from "next/navigation";
import MovieHeader from "./MovieHeader";
import MovieTabs from "./MovieInfor";
import MovieShowtime from "./MovieShowtime";
import { useMovies } from "@/hooks/useMovie";
import { useTranslation } from "react-i18next";

type MovieDetailWrapperProps = {
  id: string;
};

export default function MovieDetailWrapper({ id }: MovieDetailWrapperProps) {
  const { movies, isLoading } = useMovies();
  const { t } = useTranslation();

  if (isLoading || !movies || movies.length === 0) {
    return <div className="text-white p-10">{t("cinemas.loadingMovies")}</div>;
  }

  const movie = movies.find((m) => m.id.toString() === id);

  if (!movie) {
    console.warn("Không tìm thấy phim với id:", id);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <MovieHeader movie={movie} />
      <MovieTabs movie={movie} />
      <MovieShowtime movieId={movie.id.toString()} />
    </div>
  );
}
