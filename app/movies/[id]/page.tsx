// app/(user)/user/movies/[id]/page.tsx

import React from "react";
import MovieDetailWrapper from "./components/MovieDetailWrapper";

export default function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <MovieDetailWrapper id={params.id} />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Movie ${params.id}`,
  };
}
