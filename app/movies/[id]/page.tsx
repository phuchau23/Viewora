// app/(user)/user/movies/[id]/page.tsx

import React from "react";
import MovieDetailWrapper from "./components/MovieDetailWrapper";

type Props = {
  params: {
    id: string;
  };
};

export default function MovieDetailPage({ params }: Props) {
  return <MovieDetailWrapper id={params.id} />;
}
