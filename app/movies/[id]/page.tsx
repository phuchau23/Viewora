"use client";
import React from "react";
import MovieHeader from "./components/MovieHeader";
import MovieTabs from "./components/MovieInfor";
import MovieShowtime from "./components/MovieShowtime";
import { notFound, useParams } from "next/navigation";
import { useMovies } from "@/hooks/useMovie";

interface MovieDetailProps {
  params: {
    id: string;
  };
}

export default function MovieDetail({ params }: MovieDetailProps) {
  const { movies, isLoading } = useMovies(); // 👈 nếu có trạng thái loading
  const movieId = params.id;

  if (isLoading || movies.length === 0) {
    return <div className="text-white p-10">Đang tải dữ liệu phim...</div>;
  }

  const movie = movies.find((m) => m.id.toString() === params.id);
  // console.log("params.id:", params.id);
  // movies.forEach((m) => {
  //   const rawId = m.id;
  //   const idStr = typeof rawId === "string" ? rawId : rawId?.toString();
  //   console.log("movie id:", rawId, "as string:", idStr);
  // });

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
