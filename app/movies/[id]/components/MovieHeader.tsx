import React from "react";
import { Star, Clock, Calendar, Users } from "lucide-react";
import { Movie } from "@/lib/data";
import Image from "next/image";

interface MovieHeaderProps {
  movie: Movie;
}

export default function MovieHeader({ movie }: MovieHeaderProps) {
  const getStatusBadge = (status: Movie["status"]) => {
    const styles = {
      nowShowing: "bg-green-500 text-white",
      inComing: "bg-blue-500 text-white",
      Ended: "bg-gray-500 text-white",
    };

    const labels = {
      nowShowing: "Đang Chiếu",
      inComing: "Sắp Chiếu",
      Ended: "Đã Kết Thúc",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getAgeBadge = (age: Movie["age"]) => {
    const colors = {
      T13: "bg-green-600",
      T16: "bg-yellow-600",
      T18: "bg-red-600",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-white text-sm font-bold ${colors[age]}`}
      >
        {age}
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Banner Background */}
      <div className="relative h-[70vh] bg-black overflow-hidden">
        <Image
          src={movie.banner}
          alt={movie.title}
          className="w-full h-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <Image
                src={movie.poster}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                width={256}
                height={384}
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white space-y-2 max-w-xl mt-14 md:mt-24">
              <div className="flex flex-wrap gap-3 mb-4">
                {getStatusBadge(movie.status)}
                {getAgeBadge(movie.age)}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-base">
                {movie.rate > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{movie.rate}/5</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration} phút</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.createAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{movie.age}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {movie.movieType.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-base text-gray-200 leading-relaxed">
                {movie.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
