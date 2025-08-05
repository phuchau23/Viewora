// app/(user)/user/movies/[id]/page.tsx

import React from "react";
import MovieDetailWrapper from "./components/MovieDetailWrapper";

export default async function MovieDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <MovieDetailWrapper id={params.id} />;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return {
    title: `Movie ${params.id}`,
  };
}
