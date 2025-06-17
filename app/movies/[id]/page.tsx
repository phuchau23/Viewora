import { movies } from "@/lib/data";
import React from "react";
import MovieHeader from "./components/MovieHeader";
import MovieTabs from "./components/MovieInfor";
import { notFound } from "next/navigation";

interface MovieDetailProps {
  params: {
    id: string;
  };
}

export default function MovieDetail({ params }: MovieDetailProps) {
  const movie = movies.find((m) => m.id === params.id);

  if (!movie) {
    return notFound(); // Trả về trang 404 nếu không tìm thấy
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <MovieHeader movie={movie} />
      <MovieTabs movie={movie} />
    </div>
  );
}
