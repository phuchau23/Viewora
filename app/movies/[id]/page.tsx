"use client";

import React from "react";
import MovieHeader from "./components/MovieHeader";
import MovieTabs from "./components/MovieInfor";
import MovieShowtime from "./components/MovieShowtime";
import { notFound } from "next/navigation";
import { useMovies } from "@/hooks/useMovie";
import { useTranslation } from "react-i18next";

export default function MovieDetail({ params }: { params: { id: string } }) {
  const { movies, isLoading } = useMovies();
  const { t } = useTranslation();

  if (isLoading || movies?.length === 0) {
    return <div className="text-white p-10">{t("cinemas.loadingMovies")}</div>;
  }

  const movie = movies.find((m) => m.id.toString() === params.id);

  if (!movie) {
    console.log("Không tìm thấy phim với id:", params.id);
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
