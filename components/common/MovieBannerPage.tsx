"use client";

import Image from "next/image";

interface Props {
  title: string;
  subtitle: string;
  year: string;
  duration: number;
  rate: number;
  description: string;
  genres: string[];
  thumbnails: string[];
}

export default function MovieHero({
  title,
  subtitle,
  year,
  duration,
  rate,
  description,
  genres,
  thumbnails,
}: Props) {
  return (
    <div className="relative bg-gradient-to-t from-black via-[#440000] to-red-900 text-white min-h-screen p-10">
      {/* Biohazard symbol */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/biohazard.png"
          alt="biohazard"
          layout="fill"
          objectFit="contain"
          className="pointer-events-none"
        />
      </div>

      {/* Movie Info */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-[100px] font-bold leading-none">
          <span className="text-yellow-300">{title}</span> <br />
          {subtitle}
        </h1>
        <p className="text-yellow-200 mt-2 text-xl">{year}</p>

        <div className="flex items-center space-x-2 mt-4">
          <span className="bg-yellow-400 text-black px-2 rounded font-bold">
            4K
          </span>
          <span className="bg-white text-black px-2 rounded font-bold">
            {rate}
          </span>
          <span className="border border-white px-2 rounded">{year}</span>
          <span>{duration}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {genres.map((g, i) => (
            <span key={i} className="bg-white/20 px-3 py-1 rounded text-sm">
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="mt-4 text-white/90 max-w-xl">{description}</p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center space-x-4">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full font-semibold text-lg">
            ▶ Play
          </button>
          <button className="bg-white/10 px-4 py-2 rounded-full">♡</button>
          <button className="bg-white/10 px-4 py-2 rounded-full">i</button>
        </div>
      </div>

      {/* Thumbnail Preview Row */}
      <div className="relative z-10 mt-10 flex space-x-3 overflow-x-auto">
        {thumbnails.map((src, idx) => (
          <div
            key={idx}
            className="w-[100px] h-[60px] rounded overflow-hidden border-2 border-white/20 hover:border-white transition"
          >
            <Image src={src} alt={`thumb-${idx}`} width={100} height={60} />
          </div>
        ))}
      </div>
    </div>
  );
}
