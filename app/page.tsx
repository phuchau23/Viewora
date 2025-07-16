"use client";
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Header from "@/components/header";
import Footer from "@/components/footer";
import MovieSearch from "./movies/components/MovieSearch";
import CinemaCard from "@/components/common/cinemaCard";
import { useMovies } from "@/hooks/useMovie";
import { Loader } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const searchBoxRef = useRef(null);
  const comingRef = useRef(null);
  const showingRef = useRef(null);
  const { movies } = useMovies();
  useLayoutEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      });

      gsap.from(searchBoxRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      });

      gsap.from(comingRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: comingRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      });

      gsap.from(showingRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: showingRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      });
    });

    return () => ctx.revert();
  }, [isLoaded]);


  return (
    <div className="min-h-screen max-w-screen-xl mx-auto px-4 overflow-x-hidden">
      <Header />

      <section
        className="h-[600px] flex flex-col items-center justify-center px-4 relative"
        ref={heroRef}
      >
        <div className="absolute inset-0 bg-background z-0" />

        <div className="relative z-10 text-center mb-8 px-4" ref={titleRef}>
          <h3 className="text-2xl md:text-4xl font-bold">
            Tìm kiếm phim bạn yêu thích!
          </h3>
          <p className="mt-3 text-sm md:text-base text-black dark:text-white">
            &quot;Không bỏ lỡ khoảnh khắc – Bắt trọn từng thước phim!&quot;
          </p>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-4" ref={searchBoxRef}>
          <MovieSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </section>
      <div className="mt-12" ref={comingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-orange-500 pl-4 mb-4">
          Coming Soon
        </h2>
        <CinemaCard
          movies={movies?.filter((movie) => movie.status === "inComing")}
        />
      </div>

      <div className="mt-12" ref={showingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-red-500 pl-4 mb-4">
          Now Showing
        </h2>
        <CinemaCard
          movies={movies?.filter((movie) => movie.status === "nowShowing")}
        />
      </div>

      <Footer />
    </div>
  );
}

// ------------------ Loader Component ------------------

