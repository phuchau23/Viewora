"use client";
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Header from "@/components/header";
import Footer from "@/components/footer";
import MovieSearch from "./movies/components/MovieSearch";
import CinemaCard from "@/components/common/cinemaCard";
import { useMovies } from "@/hooks/useMovie";

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

  if (!isLoaded) {
    return <Loader onFinish={() => setIsLoaded(true)} />;
  }

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
          movies={movies.filter((movie) => movie.status === "inComing")}
        />
      </div>

      <div className="mt-12" ref={showingRef}>
        <h2 className="text-3xl font-semibold text-black dark:text-white border-l-4 border-red-500 pl-4 mb-4">
          Now Showing
        </h2>
        <CinemaCard
          movies={movies.filter((movie) => movie.status === "nowShowing")}
        />
      </div>

      <Footer />
    </div>
  );
}

// ------------------ Loader Component ------------------
function Loader({ onFinish }: { onFinish: () => void }) {
  const line1 = "THƯỚC PHIM LĂN BÁNH";
  const line2 = "CẢM XÚC ĐONG ĐẦY";
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let index1 = 0;
    let index2 = 0;

    const typeLine1 = () => {
      if (textRef.current) {
        textRef.current.innerText = line1.slice(0, index1);
        index1++;
        if (index1 <= line1.length) {
          setTimeout(typeLine1, 80);
        } else {
          setTimeout(typeLine2, 500); // 👉 Delay 0.5s trước khi gõ dòng 2
        }
      }
    };

    const typeLine2 = () => {
      if (textRef.current) {
        textRef.current.innerText = `${line1}\n${line2.slice(0, index2)}`;
        index2++;
        if (index2 <= line2.length) {
          setTimeout(typeLine2, 80);
        } else {
          gsap.to(".loader", {
            opacity: 0,
            duration: 2,
            delay: 1.2,
            onComplete: () => {
              setShowLoader(false);
              onFinish();
            },
          });
        }
      }
    };

    typeLine1();

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 0.6,
      });
    }
  }, [onFinish]);

  if (!showLoader) return null;

  return (
    <div className="loader fixed inset-0 z-[9999] bg-black text-white flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/loader-bg.mp4" type="video/mp4" />
      </video>

      <div className="text-center relative z-10">
        <div
          className={`
            text-[40px] md:text-[72px] font-extrabold leading-tight tracking-wide whitespace-pre-wrap font-['Bebas_Neue','Anton','sans-serif']
            bg-gradient-to-r from-yellow-300 via-red-500 to-orange-400 bg-clip-text text-transparent
            dark:drop-shadow-[0_2px_10px_rgba(255,100,0,0.6)]
            light:text-black
          `}
        >
          <div ref={textRef} className="inline-block" />
          <span
            ref={cursorRef}
            className="inline-block w-[5px] h-[1em] bg-white ml-2 align-middle"
          />
        </div>

        <div className="mt-6 text-sm text-gray-400 font-mono tracking-widest uppercase">
          Loading cinematic experience...
        </div>
      </div>
    </div>
  );
}
