"use client";
import React, { useState } from "react";
import { User, Calendar, Clock, Film, Play, Star, X } from "lucide-react";
import Image from "next/image";
import { Movies } from "@/lib/api/service/fetchMovies";
import MovieRatingComment from "./MovieRatingComment";
import { useTranslation } from "react-i18next";

interface MovieTabsProps {
  movie: Movies;
}

export default function MovieTabs({ movie }: MovieTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"info" | "trailer" | "rating">(
    "info"
  );
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const tabs = [
    { id: "info", label: t("movietabs.info"), icon: Film },
    { id: "trailer", label: t("movietabs.trailer"), icon: Play },
    { id: "rating", label: t("movietabs.rating"), icon: Star },
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
                  onClick={() =>
                    setActiveTab(tab.id as "info" | "trailer" | "rating")
                  }
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
            <div className="animate-fade-in">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex gap-6 w-full">
                  <div className="w-2/3">
                    <h2 className="text-3xl font-bold mb-6 text-orange-400">
                      {t("details.title")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Film className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {t("details.director")}
                            </p>
                            <p className="text-lg">{movie.director}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {t("details.duration")}
                            </p>
                            <p className="text-lg">
                              {movie.duration} {t("details.minute")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 dark:text-white mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {t("details.release")}
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
                              {t("details.age")}
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
                        {t("details.actor")}
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-800 dark:text-white">
                        {movie.actor}
                      </p>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 text-orange-400">
                        {t("details.genre")}
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
                    {t("details.content")}
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
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-orange-400 mb-3 tracking-wide">
                      {t("trailer.info")}
                    </h4>
                    <div className="space-y-2 text-xs text-gray-200">
                      <p className="flex gap-2">
                        <span className="text-gray-400 font-medium">
                          {t("trailer.quality")}
                        </span>
                        <span className="font-semibold text-black dark:text-white">
                          HD 1080p
                        </span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-gray-400 font-medium">
                          {t("trailer.language")}
                        </span>
                        <span className="font-semibold text-black dark:text-white">
                          Tiếng Việt, Tiếng Anh
                        </span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-gray-400 font-medium">
                          {t("trailer.subtitle")}
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
                    <img
                      src={movie.banner}
                      alt={`${movie.name} trailer`}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-60 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsTrailerOpen(true)}
                        className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label={t("trailer.play")}
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold tracking-wide">
                        {movie.name} - {t("trailer.official")}
                      </h3>
                      <p className="text-gray-200 text-xs mt-1 font-medium">
                        {t("details.duration")}: {movie.duration}{" "}
                        {t("details.minute")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rating" && (
            <div className="animate-fade-in">
              <MovieRatingComment movieId={movie.id} />
            </div>
          )}
        </div>

        {/* Trailer Modal */}
        {isTrailerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsTrailerOpen(false)}
          >
            <div
              className="relative w-full max-w-6xl aspect-video"
              onClick={(e) => e.stopPropagation()}
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
