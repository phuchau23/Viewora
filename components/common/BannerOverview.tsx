// components/BannerSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";
import { Movie } from "@/utils/data";

interface Props {
  movies: Movie[];
}

export default function BannerSlider({ movies }: Props) {
  return (
    <div className="w-full max-w-screen-xl mx-auto mb-8">
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="rounded-xl overflow-hidden"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-[500px]">
              <Image
                src={movie.banner}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-4xl font-bold">{movie.title}</h2>
                <p className="mt-2 text-lg max-w-xl line-clamp-3">
                  {movie.detail || "No description available."}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
