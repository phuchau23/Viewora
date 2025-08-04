"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Play, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  name: string;
  description: string;
  poster: string;
  rate: number;
  duration: number;
  director: string;
  age: string;
  releaseDate: string;
}

interface HeroSliderProps {
  featuredMovies: Movie[];
}

export default function HeroSlider({ featuredMovies }: HeroSliderProps) {
  const router = useRouter();

  const handleWatchTrailer = (movieId: string) => {
    // Handle trailer watching logic
    console.log("Watch trailer for movie:", movieId);
  };

  const handleMovieDetails = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <Swiper
        effect="creative"
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/50 !w-3 !h-3",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-white !scale-125",
        }}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-120%", 0, -500],
            rotate: [0, 0, -15],
          },
          next: {
            shadow: true,
            translate: ["120%", 0, -500],
            rotate: [0, 0, 15],
          },
        }}
        modules={[EffectCreative, Autoplay, Pagination]}
        className="w-full h-full [&_.swiper-pagination]:!bottom-8 [&_.swiper-pagination]:!left-8 [&_.swiper-pagination]:!w-auto"
      >
        {featuredMovies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.name}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  quality={90}
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Movie Information */}
                    <div className="space-y-8 max-w-2xl">
                      {/* Badges */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 text-sm font-semibold shadow-lg border-0 transition-all duration-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          Đang chiếu
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-2 border-white/30 text-white bg-black/30 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-white/10 transition-all duration-300"
                        >
                          {movie.age}
                        </Badge>
                      </div>

                      {/* Title */}
                      <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                          {movie.name}
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full" />
                      </div>

                      {/* Description */}
                      <p className="text-lg lg:text-xl text-gray-200 leading-relaxed font-light line-clamp-4 max-w-xl">
                        {movie.description}
                      </p>

                      {/* Movie Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <Star className="h-5 w-5 text-gray-400" />
                          </div>
                          <span className="font-semibold text-lg">
                            {movie.rate}/5
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Clock className="h-5 w-5 text-blue-400" />
                          <span className="font-medium">
                            {movie.duration} phút
                          </span>
                        </div>
                        <div className="text-gray-300">
                          <span className="text-sm">Đạo diễn</span>
                          <p className="font-semibold text-white">
                            {movie.director}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Movie Poster (Optional - for larger screens) */}
                    <div className="hidden lg:flex justify-center items-center">
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                        <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <Image
                            src={movie.poster || "/placeholder.svg"}
                            alt={movie.name}
                            width={300}
                            height={450}
                            className="rounded-xl shadow-2xl object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Fade */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Dots */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {featuredMovies.map((_, index) => (
          <div
            key={index}
            className="w-12 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div className="w-full h-full bg-gradient-to-r from-red-600 to-yellow-500 rounded-full transform -translate-x-full animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
