"use client";
import React, { useMemo } from "react";
import { Film } from "lucide-react";
import ChartCard from "./ChartCard";
import { motion } from "framer-motion";
import { useMovies } from "@/hooks/useMovie";
import { useTranslation } from "react-i18next";

const DashboardRecentMovies: React.FC = () => {
  const { t } = useTranslation();
  const { movies, isLoading, isError, error } = useMovies(1, 20);

  const nowShowingMovies = useMemo(() => {
    const safeMovies = movies ?? [];
    return safeMovies
      .filter((m: any) => m.status === "nowShowing")
      .sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      )
      .slice(0, 5);
  }, [movies]);

  if (isError) {
    return (
      <ChartCard
        title={t("dash.nowShowing")}
        icon={<Film className="h-5 w-5 text-orange-500" />}
        isLoading={false}
      >
        <p className="text-center text-red-500">
          {error?.message || t("dash.errorDefault")}
        </p>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title={t("dash.nowShowing")}
      icon={<Film className="h-5 w-5 text-orange-500" />}
      isLoading={isLoading}
    >
      <div className="space-y-4 h-full">
        {nowShowingMovies.length > 0 ? (
          nowShowingMovies.map((movie: any, index: number) => (
            <motion.div
              key={movie.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h4 className="text-md font-semibold">{movie.name}</h4>
              <p className="text-sm text-gray-500">
                {t("dash.released")}:{" "}
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">
            {t("dash.noNowShowing")}
          </p>
        )}
      </div>
    </ChartCard>
  );
};

export default DashboardRecentMovies;
