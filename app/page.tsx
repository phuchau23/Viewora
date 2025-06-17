"use client";

import { useState, useEffect, useRef } from "react";
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
  Ticket,
  Popcorn,
  Heart,
  Share2,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { movies, formatDuration, promotions } from "@/lib/data";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PromotionService, {
  Promotion,
  PromotionListResponse,
} from "@/lib/api/service/fetchPromotion";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const sliderRef = useRef<HTMLDivElement>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [promotionsError, setPromotionsError] = useState<string | null>(null);

  // For image error fallback (shared for both movies & promos)

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setPromotionsLoading(true);
        const response: PromotionListResponse =
          await PromotionService.getPromotions();
        setPromotions(response.data.items);
      } catch (err) {
        setPromotionsError(
          "Failed to load promotions. Please try again later."
        );
      } finally {
        setPromotionsLoading(false);
      }
    };
    fetchPromotions();
  }, []);
  // Get unique genres from all movies
  const allGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.category))
  );

  const featuredMovies = movies
    .filter((movie) => movie.status === "nowShowing")
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

  // const nextSlide = () => {
  //   console.log("Next Slide");
  //   setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) =>
  //     prev === 0 ? featuredMovies.length - 1 : prev - 1
  //   );
  // };

  const handleWheel = (e: React.WheelEvent) => {
    if (sliderRef.current) {
      if (e.deltaY > 0) {
        sliderRef.current.scrollLeft += 100;
      } else {
        sliderRef.current.scrollLeft -= 100;
      }
    }
  };

  const incrementTickets = (movieId: string) => {
    setTicketCounts((prev) => ({
      ...prev,
      [movieId]: (prev[movieId] || 0) + 1,
    }));
  };

  const decrementTickets = (movieId: string) => {
    setTicketCounts((prev) => ({
      ...prev,
      [movieId]: Math.max((prev[movieId] || 0) - 1, 0),
    }));
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre
      ? movie.category.includes(selectedGenre)
      : true;
    return matchesSearch && matchesGenre;
  });

  const nowShowingMovies = filteredMovies.filter(
    (movie) => movie.status === "nowShowing"
  );
  const comingSoonMovies = filteredMovies.filter(
    (movie) => movie.status === "inComing"
  );

  const validateYouTubeUrl = (url: string) => {
    if (!url || url.includes("placeholder")) {
      return "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Fallback to a valid YouTube video
    }
    return url.replace("watch?v=", "embed/");
  };

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <main className="font-sans bg-background text-foreground">
      <Header />

      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {" "}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10"></div>
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative h-full w-full">
              {imageError[movie.id + "-banner"] ? (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Unable to load image</p>
                </div>
              ) : (
                <Image
                  src={movie.banner}
                  alt={movie.title}
                  fill
                  className="object-cover brightness-75"
                  priority={index === 0}
                  quality={85}
                  onError={() => handleImageError(movie.id + "-banner")}
                />
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/80 to-transparent h-1/2"></div>

            <div className="absolute bottom-0 left-0 right-0 z-30 container px-6 pb-16 md:pb-24">
              <div className="max-w-3xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm font-medium">
                    {movie.age}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(movie.startShow).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {movie.category.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="text-sm font-normal bg-background/50 backdrop-blur-sm"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{movie.rate}/5</span>
                  </div>
                </div>

                <p className="line-clamp-3 text-muted-foreground text-base">
                  {movie.detail}
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <Button
                    asChild
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Link href={`/booking/${movie.id}`}>
                      <Ticket className="h-4 w-4" /> Book Tickets
                    </Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setTrailerUrl(movie.trailer)}
                      >
                        <Play className="h-4 w-4" /> Watch Trailer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0">
                      <div className="relative aspect-video">
                        {trailerUrl ? (
                          <iframe
                            src={validateYouTubeUrl(trailerUrl)}
                            title={`${movie.title} Trailer`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onError={() => (
                              <div className="h-full w-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">
                                  Unable to load trailer
                                </p>
                              </div>
                            )}
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Unable to load trailer
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
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

      {/* Quick Booking Bar */}
      <section className="bg-transparent py-8 px-2 md:px-0">
        <div className="container max-w-6xl mx-auto">
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 md:py-3 md:px-6 bg-white/70 dark:bg-zinc-900/70 border-2 border-orange-100 dark:border-orange-900 rounded-full shadow-2xl backdrop-blur-lg overflow-x-auto">
            {/* Title */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-200 dark:from-orange-600 dark:to-amber-500 shadow-lg p-1.5 ring-2 ring-white/60 dark:ring-zinc-900/40">
                <Popcorn className="h-4 w-4 text-white dark:text-zinc-100" />
              </span>
              <h3 className="text-sm font-bold tracking-tight text-orange-600 dark:text-orange-300 whitespace-nowrap">
                Quick Booking
              </h3>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[8rem] max-w-xs md:max-w-sm group">
              <Input
                placeholder="Search movies or showtimes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
            rounded-full border-0 shadow-md bg-orange-50/60 dark:bg-orange-900/80
            pl-10 pr-4 py-2 text-sm
            text-orange-600 dark:text-orange-200
            placeholder:text-orange-400 dark:placeholder:text-orange-300
            focus:ring-2 focus:ring-orange-400 focus:bg-white/90 dark:focus:bg-zinc-950/90
            transition-all
            w-full
          `}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 dark:text-orange-300 pointer-events-none">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.68-4.68A7 7 0 1 1 5 5a7 7 0 0 1 13.33 6.97z"
                  />
                </svg>
              </span>
            </div>

            {/* Genre Pills */}
            <ScrollArea className="max-w-full shrink-0">
              <div
                className="flex gap-1 pr-2 relative z-10"
                style={{ position: "relative" }}
              >
                {allGenres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "ghost"}
                    size="sm"
                    onClick={() =>
                      setSelectedGenre(selectedGenre === genre ? null : genre)
                    }
                    className={
                      "rounded-full text-xs px-3 py-1 font-semibold border-0 shadow " +
                      (selectedGenre === genre
                        ? "bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg"
                        : "bg-orange-50/60 dark:bg-orange-900/70 text-orange-600 dark:text-orange-200 hover:bg-orange-200/50 dark:hover:bg-orange-800/60")
                    }
                    style={{
                      boxShadow: "0 2px 8px 0 rgba(255, 156, 0, 0.10)", // shadow cam nhạt & nổi lên
                      marginBottom: "0.5rem", // đẩy pills lên trên để không bị che chân
                    }}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </section>

      {/* Movie Categories */}
      <section className="container px-6 py-12 md:py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
              Explore the World of Cinema
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              From blockbusters to upcoming releases
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="gap-2 text-primary border-primary hover:bg-primary hover:text-white transition-colors rounded-full"
          >
            <Link href="/movies">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="now-showing" className="w-full">
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl mx-auto bg-muted/50 rounded-full p-1">
            <TabsTrigger
              value="now-showing"
              className="rounded-full py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Now Showing
            </TabsTrigger>
            <TabsTrigger
              value="coming-soon"
              className="rounded-full py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Coming Soon
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="rounded-full py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Special Screenings
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-full py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Upcoming Releases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="now-showing" className="mt-0">
            {nowShowingMovies.length > 0 ? (
              <div
                ref={sliderRef}
                onWheel={handleWheel}
                className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-hide"
              >
                {nowShowingMovies.map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-64 snap-start">
                    <Card
                      className="overflow-hidden group hover:shadow-2xl transition-shadow duration-300 border-none bg-background/80 backdrop-blur-sm"
                      onMouseEnter={() => setHoveredMovie(movie.id)}
                      onMouseLeave={() => setHoveredMovie(null)}
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        {imageError[movie.id + "-poster"] ? (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Unable to load image
                            </p>
                          </div>
                        ) : (
                          <Image
                            src={movie.poster}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            quality={75}
                            onError={() =>
                              handleImageError(movie.id + "-poster")
                            }
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                asChild
                                className="w-full bg-primary hover:bg-primary/90 rounded-lg"
                              >
                                <Link href={`/booking/${movie.id}`}>
                                  Book Tickets
                                </Link>
                              </Button>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="h-8 w-8 flex-1 bg-background/80 hover:bg-background rounded-full"
                                      onClick={() =>
                                        setTrailerUrl(movie.trailer)
                                      }
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl p-0 border-none">
                                    <div className="relative aspect-video">
                                      {trailerUrl ? (
                                        <iframe
                                          src={validateYouTubeUrl(trailerUrl)}
                                          title={`${movie.title} Trailer`}
                                          className="w-full h-full rounded-lg"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          onError={() => (
                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                              <p className="text-muted-foreground">
                                                Unable to load trailer
                                              </p>
                                            </div>
                                          )}
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-muted flex items-center justify-center">
                                          <p className="text-muted-foreground">
                                            Unable to load trailer
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-8 w-8 bg-background/80 hover:bg-background rounded-full"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 rounded-full">
                          Now Showing
                        </Badge>
                      </div>
                      <CardContent className="p-4 bg-background">
                        <h3 className="font-semibold truncate mb-1 text-lg">
                          <Link
                            href={`/movies/${movie.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {movie.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{movie.category[0]}</span>
                          <span>•</span>
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm">{movie.rate}/5</span>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            {movie.age}
                          </Badge>
                        </div>
                      </CardContent>
                      {hoveredMovie === movie.id && (
                        <CardFooter className="p-4 border-t bg-muted/50">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => decrementTickets(movie.id)}
                                className="h-8 w-8 rounded-full"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span>{ticketCounts[movie.id] || 0}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => incrementTickets(movie.id)}
                                className="h-8 w-8 rounded-full"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button size="sm" asChild className="rounded-lg">
                              <Link href={`/booking/${movie.id}`}>
                                Select Seats
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No movies found matching your criteria
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="coming-soon" className="mt-0">
            {comingSoonMovies.length > 0 ? (
              <div
                ref={sliderRef}
                onWheel={handleWheel}
                className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-hide"
              >
                {comingSoonMovies.map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-64 snap-start">
                    <Card className="overflow-hidden group hover:shadow-2xl transition-shadow duration-300 border-none bg-background/80 backdrop-blur-sm">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        {imageError[movie.id + "-poster"] ? (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Unable to load image
                            </p>
                          </div>
                        ) : (
                          <Image
                            src={movie.poster}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            quality={75}
                            onError={() =>
                              handleImageError(movie.id + "-poster")
                            }
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full gap-1 bg-background/80 rounded-lg"
                              >
                                <CalendarDays className="h-3 w-3" />
                                {new Date(movie.startShow).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </Button>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="h-8 w-8 flex-1 bg-background/80 hover:bg-background rounded-full"
                                      onClick={() =>
                                        setTrailerUrl(movie.trailer)
                                      }
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl p-0 border-none">
                                    <div className="relative aspect-video">
                                      {trailerUrl ? (
                                        <iframe
                                          src={validateYouTubeUrl(trailerUrl)}
                                          title={`${movie.title} Trailer`}
                                          className="w-full h-full rounded-lg"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          onError={() => (
                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                              <p className="text-muted-foreground">
                                                Unable to load trailer
                                              </p>
                                            </div>
                                          )}
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-muted flex items-center justify-center">
                                          <p className="text-muted-foreground">
                                            Unable to load trailer
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-8 w-8 bg-background/80 hover:bg-background rounded-full"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 rounded-full">
                          Coming Soon
                        </Badge>
                      </div>
                      <CardContent className="p-4 bg-background">
                        <h3 className="font-semibold truncate mb-1 text-lg">
                          <Link
                            href={`/movies/${movie.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {movie.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{movie.category[0]}</span>
                          <span>•</span>
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm">Coming Soon</span>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            {movie.age}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No upcoming movies found matching your criteria
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="special" className="mt-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Check back soon for more information on special screenings and
                events
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <div
              ref={sliderRef}
              onWheel={handleWheel}
              className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
              {movies
                .filter((movie) => movie.status === "inComing")
                .sort(
                  (a, b) =>
                    new Date(a.startShow).getTime() -
                    new Date(b.startShow).getTime()
                )
                .map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-64 snap-start">
                    <Card className="overflow-hidden border-none bg-background/80 backdrop-blur-sm">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        {imageError[movie.id + "-poster"] ? (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Unable to load image
                            </p>
                          </div>
                        ) : (
                          <Image
                            src={movie.poster}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            quality={75}
                            onError={() =>
                              handleImageError(movie.id + "-poster")
                            }
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 rounded-full">
                          Coming Soon
                        </Badge>
                      </div>
                      <CardContent className="p-4 bg-background">
                        <h3 className="font-semibold truncate mb-1 text-lg">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{movie.category[0]}</span>
                          <span>•</span>
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarDays className="h-3 w-3" />
                            <span>
                              {new Date(movie.startShow).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            {movie.age}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* Promotions & Offers */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Promotions & Offers
              </h2>
              <p className="text-muted-foreground">
                Special offers to enhance your movie-watching experience
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/user/promotions">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {promotionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <Card key={idx} className="h-64 animate-pulse" />
              ))}
            </div>
          ) : promotionsError ? (
            <div className="text-red-500">{promotionsError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.slice(0, 3).map((promo) => (
                <Card
                  key={promo.id}
                  className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-none"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Link
                      href={`/user/promotions/${promo.id}`}
                      className="block w-full h-full"
                    >
                      {imageError[promo.id + "-promo"] ? (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Unable to load image
                          </p>
                        </div>
                      ) : (
                        <Image
                          src={promo.image}
                          alt={promo.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          quality={75}
                          onError={() => handleImageError(promo.id + "-promo")}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
                        Limited Time
                      </Badge>
                    </Link>
                  </div>
                  <CardContent className="p-5 bg-background">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{promo.title}</h3>
                      {promo.discountPrice ? (
                        <Badge variant="secondary" className="text-xs">
                          {promo.discountTypeEnum === "PERCENT"
                            ? `${promo.discountPrice}% OFF`
                            : `${promo.discountPrice} OFF`}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Valid until:{" "}
                        {new Date(promo.endTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
