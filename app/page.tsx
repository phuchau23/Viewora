"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  CalendarDays,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { movies, formatDuration, promotions } from "@/lib/data";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const featuredMovies = movies
    .filter((movie) => movie.status === "now-showing")
    .slice(0, 5);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoplay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [autoplay, featuredMovies.length]);

  const nextSlide = () => {
    setAutoplay(false);
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setAutoplay(false);
    setCurrentSlide(
      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
    )
  };

  return (
    <main className="font-sans">
      <Header />
      <div className="flex flex-col">
      {/* Hero Slider */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>

          {featuredMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/80 to-transparent h-1/3"></div>

              <div className="absolute bottom-0 left-0 right-0 z-30 container px-4 pb-16 md:pb-24">
                <div className="max-w-3xl">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {movie.genre.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-6">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(movie.duration)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{movie.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <Link href={`/booking/${movie.id}`}>Buy Tickets</Link>
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Play className="h-4 w-4" /> Watch Trailer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-0 right-0 z-30 px-4 pb-16 md:pb-24 flex gap-2">
            <Button size="icon" variant="ghost" onClick={prevSlide}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button size="icon" variant="ghost" onClick={nextSlide}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute bottom-32 left-0 right-0 z-30 flex justify-center gap-2">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-primary w-8" : "bg-primary/30"
                }`}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentSlide(index);
                }}
              />
            ))}
          </div>
        </section>

        {/* Movie Categories */}
        <section className="container px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Movies</h2>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/users/promotions">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="now-showing" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="now-showing">Now Showing</TabsTrigger>
              <TabsTrigger value="coming-soon">Coming Soon</TabsTrigger>
            </TabsList>

            <TabsContent value="now-showing" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies
                  .filter((movie) => movie.status === "now-showing")
                  .map((movie) => (
                    <Card key={movie.id} className="overflow-hidden group">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={movie.image}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex gap-2 mb-2">
                              <Button size="sm" asChild>
                                <Link href={`/booking/${movie.id}`}>
                                  Buy Tickets
                                </Link>
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate mb-1">
                          <Link
                            href={`/movies/${movie.id}`}
                            className="hover:text-primary"
                          >
                            {movie.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{movie.genre[0]}</span>
                          <span>•</span>
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="coming-soon" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies
                  .filter((movie) => movie.status === "coming-soon")
                  .map((movie) => (
                    <Card key={movie.id} className="overflow-hidden group">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={movie.image}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex gap-2 mb-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                              >
                                <CalendarDays className="h-3 w-3" />{" "}
                                {new Date(movie.releaseDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                          Coming Soon
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate mb-1">
                          <Link
                            href={`/movies/${movie.id}`}
                            className="hover:text-primary"
                          >
                            {movie.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{movie.genre[0]}</span>
                          <span>•</span>
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Promotions */}
        <section className="bg-muted py-12 md:py-16">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Promotions & Offers
              </h2>
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/promotions">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <Card key={promo.id} className="overflow-hidden group">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      {promo.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Valid until:{" "}
                        {new Date(promo.validUntil).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
