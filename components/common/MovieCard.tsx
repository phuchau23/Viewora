import React, { useState } from "react";
import { Star, Clock, Calendar, Users, PlayCircle, Info } from "lucide-react";
import { formatDuration, Movie } from "@/utils/data";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadge = (status: Movie["status"]) => {
    switch (status) {
      case "nowShowing":
        return {
          text: "Now Showing",
          className:
            "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg",
        };
      case "inComing":
        return {
          text: "Coming Soon",
          className:
            "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg",
        };
      case "Ended":
        return {
          text: "Ended",
          className:
            "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg",
        };
      default:
        return { text: "", className: "" };
    }
  };

  const statusBadge = getStatusBadge(movie.status);

  return (
    <Link href={`/movies/${movie.id}`}>
      <div
        className="group relative bg-white dark:bg-black rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border transform hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Movie Poster */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            onLoad={() => setImageLoaded(true)}
            className={`object-cover transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Status Badge - Top Left */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${statusBadge.className}`}
            >
              {statusBadge.text}
            </span>
          </div>

          {/* Age Rating - Top Right */}
          <div className="absolute top-4 right-4">
            <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {movie.age}
            </div>
          </div>

          {/* Hover Information Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl font-bold mb-3 line-clamp-2">
                {movie.title}
              </h3>

              <p className="text-sm text-gray-200 mb-4 line-clamp-3">
                {movie.detail}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-amber-400" />
                  <span className="truncate">{movie.director}</span>
                </div>

                <div className="flex items-center text-sm">
                  <span className="text-gray-300">Cast: </span>
                  <span className="ml-1 truncate">
                    {movie.actor.slice(0, 2).join(", ")}
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
                {movie.movieType.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30"
                  >
                    {genre}
                  </span>
                ))}
                {movie.movieType.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    +{movie.movieType.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
