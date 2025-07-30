"use client";

import { useRef } from "react";
import { Navigation, EffectCoverflow, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import { Users } from "lucide-react";
import Link from "next/link";
import { Movies } from "@/lib/api/service/fetchMovies";

interface CinemaCardProps {
  movies: Movies[];
}
export default function CinemaCard({ movies }: CinemaCardProps) {
  const swiperRef = useRef<SwiperClass>();

  return (
    <div className="relative w-[400px] h-[500px] mx-auto mt-8 px-4">
      {/* Navigation buttons (move these inside Swiper) */}
      <div className="h-10 w-10 mx-auto my-auto swiper-button-prev absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white text-2xl hover:scale-125 transition rounded-full bg-black/30 dark:bg-white/30 flex items-center justify-center">
        ‹
      </div>
      <div className="h-10 w-10 mx-auto my-2 swiper-button-next absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white text-2xl hover:scale-125 transition rounded-full bg-black/30 dark:bg-white/30 flex items-center justify-center">
        ›
      </div>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        loop={true}
        centeredSlides={true}
        spaceBetween={20}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, EffectCoverflow, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="w-full h-[500px] !overflow-visible"
      >
        {movies?.map((movie) => (
          <SwiperSlide
            style={{ width: "400px" }}
            key={movie.id}
            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay.start()}
            className="w-[400px] h-[500px] relative rounded-xl overflow-hidden shadow-2xl group"
          >
            <Link href={`/movies/${movie.id}`}>
              <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-black/70 to-transparent ">
                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  {movie.name}
                </h3>

                <p className="text-sm text-gray-200 mb-4 line-clamp-3">
                  {movie.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-amber-400" />
                    <span className="truncate">{movie.director}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-300">Cast: </span>
                    <span className="ml-1 truncate">
                      {movie.actor.slice(0, 2)}
                    </span>
                    {movie.actor.length > 2 && (
                      <span className="text-amber-400">
                        {" "}
                        +{movie.actor.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {movie.movieTypes.slice(0, 3).map((genre, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {movie.movieTypes.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      +{movie.movieTypes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
