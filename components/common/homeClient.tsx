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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Ticket, Play } from "lucide-react";
import HeroAnimation from "./Heroanimation";
import HeroSlider from "./Heroanimation";
export default function HomeClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const comingRef = useRef(null);
  const showingRef = useRef(null);
  const { movies } = useMovies();

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto px-4 overflow-x-hidden">
      <Header />
      <PageIntroReveal />
      <HeroSlider
        featuredMovies={movies?.filter(
          (movie) => movie.status === "nowShowing"
        )}
      />
      <div className="mt-12" ref={comingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-orange-500 pl-4 mb-4">
          {t("comingSoon")}
        </h2>
        <CinemaCard
          movies={movies?.filter((movie) => movie.status === "inComing")}
          uniqueId="comingSoon"
        />
      </div>
      <div className="mt-12" ref={showingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-red-500 pl-4 mb-4">
          {t("nowShowing")}
        </h2>
        <CinemaCard
          movies={movies?.filter((movie) => movie.status === "nowShowing")}
          uniqueId="nowShowing"
        />
      </div>
      <PromotionsSection />
      <Footer />
    </div>
  );
}
