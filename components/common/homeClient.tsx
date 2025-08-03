"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CinemaCard from "@/components/common/cinemaCard";
import { useMovies } from "@/hooks/useMovie";
import MovieSearch from "@/app/movies/components/MovieSearch";
import PageIntroReveal from "./IntroPage";
import { motion } from "framer-motion";
import PromotionsSection from "./promotion-section";

export default function HomeClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const searchBoxRef = useRef(null);
  const comingRef = useRef(null);
  const showingRef = useRef(null);
  const { movies } = useMovies();

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto px-4 overflow-x-hidden">
      <Header />
      <PageIntroReveal />
      <section
        className="h-[600px] flex flex-col items-center justify-center px-4 relative"
        ref={heroRef}
      >
        <div className="absolute inset-0 bg-background z-0" />

        <motion.div
          className="relative z-10 text-center mb-8 px-4"
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          <h3 className="text-2xl md:text-4xl font-bold">{t("searchTitle")}</h3>
          <p className="mt-3 text-sm md:text-base text-black dark:text-white">
            {t("searchSubtitle")}
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 w-full max-w-2xl px-4"
          ref={searchBoxRef}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            delay: 0.4,
          }}
        >
          <MovieSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </motion.div>
      </section>
      <div className="mt-12" ref={comingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-orange-500 pl-4 mb-4">
          {t("comingSoon")}
        </h2>
        <CinemaCard
          movies={movies?.filter((movie) => movie.status === "inComing")}
        />
      </div>
      <div className="mt-12" ref={showingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-red-500 pl-4 mb-4">
          {t("nowShowing")}
        </h2>
        <CinemaCard
          movies={movies?.filter((movie) => movie.status === "nowShowing")}
        />
      </div>
      <PromotionsSection />
      <Footer />
    </div>
  );
}
