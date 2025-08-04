// app/(user)/user/movies/[id]/page.tsx
"use client";

import React from "react";
import MovieDetailWrapper from "./components/MovieDetailWrapper";

export default function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <MovieDetailWrapper id={params.id} />;
}
