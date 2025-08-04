// app/(user)/user/movies/[id]/page.tsx

import React from "react";
import MovieDetailWrapper from "./components/MovieDetailWrapper";

type PageProps = {
  params: {
    id: string;
  };
};

export default function MovieDetailPage({ params }: PageProps) {
  return <MovieDetailWrapper id={params.id} />;
}
