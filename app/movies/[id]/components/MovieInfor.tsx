"use client";
import React, { useState } from "react";
import { User, Calendar, Clock, Film, Play, X } from "lucide-react";
import Image from "next/image";
import { Movie } from "@/lib/api/service/fetchMovies";

interface MovieTabsProps {
  movie: Movie;
}

export default function MovieTabs({ movie }: MovieTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "trailer">("info");
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const tabs = [
    { id: "info", label: "Thông tin phim", icon: Film },
    { id: "trailer", label: "Trailer & Video", icon: Play },
  ];

  return (
    <div className="bg-slate-50 dark:bg-background dark:text-white text-black py-8">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        {/* Tab Navigation */}
        <div className="flex mb-12">
          <div className="flex justify-center bg-slate-50 dark:bg-background dark:text-white text-black p-1 rounded-lg border border-foreground">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "info" | "trailer")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-orange-400 text-background hover:text-background hover:bg-orange-400"
                      : "text-gray-300 hover:text-white hover:bg-orange-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Tab Content */}
        <div className="min-h-[auto]">
          {activeTab === "info" && (
            <div className=" animate-fade-in">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex gap-6 w-full">
                  <div className="w-2/3">
                    <h2 className="text-3xl font-bold mb-6 text-orange-400">
                      Chi tiết phim
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Film className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              Đạo diễn
                            </p>
                            <p className="text-lg">{movie.director}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              Thời lượng
                            </p>
                            <p className="text-lg">{movie.duration} phút</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              Khởi chiếu
                            </p>
                            <p className="text-lg">
                              {new Date(movie.startShow).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              Độ tuổi
                            </p>
                            <p className="text-lg">{movie.age}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-7 mt-2">
                      <h3 className="text-2xl font-bold mb-4 text-orange-400">
                        Diễn viên
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-800 dark:text-white">
                        {movie.actor}
                      </p>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 text-orange-400">
                        Thể loại
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.movieTypes.map((genre, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-medium dark:bg-yellow-600 dark:text-white"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-orange-400">
                    Nội dung phim
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-800 dark:text-white">
                    {movie.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trailer" && (
            <div className="animate-fade-in">
              <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 border border-gray-700 p-6 rounded-lg">
                {/* Additional Video Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-orange-400 mb-3 tracking-wide">
                      Thông tin video
                    </h4>
                    <div className="space-y-2 text-xs text-gray-200">
                      <p className="flex gap-2">
                        <span className="text-gray-400 font-medium">
                          Chất lượng:
                        </span>
                        <span className="font-semibold text-black dark:text-white">
                          HD 1080p
                        </span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-gray-400 font-medium">
                          Ngôn ngữ:
                        </span>
                        <span className="font-semibold text-black dark:text-white">
                          Tiếng Việt, Tiếng Anh
                        </span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-gray-400 font-medium">
                          Phụ đề:
                        </span>
                        <span className="font-semibold text-black dark:text-white">
                          Tiếng Việt
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                      src={movie.banner?.[0] || "/fallback.jpg"} // fallback ảnh mặc định
                      alt="Banner"
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsTrailerOpen(true)}
                        className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Play Trailer"
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold tracking-wide">
                        {movie.name} - Official Trailer
                      </h3>
                      <p className="text-gray-200 text-xs mt-1 font-medium">
                        Thời lượng: {movie.duration} phút
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trailer Modal */}
        {isTrailerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsTrailerOpen(false)} // Thêm sự kiện onClick cho div bao ngoài
          >
            <div
              className="relative w-full max-w-6xl aspect-video"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan truyền lên div cha
            >
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-8 h-8" />
              </button>

              <iframe
                src={getYouTubeEmbedUrl(movie.trailerUrl)}
                title={`${movie.name} Trailer`}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
