import React from "react";
import MoviesPage from "./components/MoviePage";
import CinemaBanner from "@/components/common/cinemaCard";
import { useMovies } from "@/hooks/useMovie";
function Movies() {
  const { movies } = useMovies();
  return (
    <div className="min-h-screen max-w-screen-xl mx-auto px-4">
      <CinemaBanner movies={movies} />
      <MoviesPage />
    </div>
  );
}

export default Movies;
