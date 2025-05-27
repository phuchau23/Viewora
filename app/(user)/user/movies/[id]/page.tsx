"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, Calendar, Star, Users, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { movies, formatDuration, cinemas, showtimes, formatCurrency } from "@/lib/data";

export default function MovieDetailPage() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);
  
  if (!movie) {
    return (
      <div className="container px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground mb-6">The movie you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/movies">Back to Movies</Link>
        </Button>
      </div>
    );
  }
  
  // Group showtimes by date and cinema
  const movieShowtimes = showtimes.filter((s) => s.movieId === movie.id);
  
  const showtimesByDate = movieShowtimes.reduce((acc, showtime) => {
    if (!acc[showtime.date]) {
      acc[showtime.date] = {};
    }
    
    if (!acc[showtime.date][showtime.cinemaId]) {
      acc[showtime.date][showtime.cinemaId] = [];
    }
    
    acc[showtime.date][showtime.cinemaId].push(showtime);
    return acc;
  }, {} as Record<string, Record<string, typeof showtimes>>);
  
  const dates = Object.keys(showtimesByDate).sort();
  
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <Image
          src={movie.image}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/80 to-transparent h-24"></div>
      </div>

      {/* Movie Details */}
      <div className="container px-4 -mt-32 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={movie.image}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-5">
              {movie.genre.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Duration</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Release Date</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{movie.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={movie.status === "now-showing" ? "default" : "secondary"}>
                  {movie.status === "now-showing" ? "Now Showing" : "Coming Soon"}
                </Badge>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Synopsis</h3>
              <p className="text-muted-foreground">{movie.synopsis}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Director</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{movie.director}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cast</h3>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{movie.cast.join(", ")}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {movie.status === "now-showing" ? (
                <Button className="gap-2\" asChild>
                  <Link href="#showtimes">
                    Buy Tickets
                  </Link>
                </Button>
              ) : (
                <Button disabled>Coming Soon</Button>
              )}
              <Button variant="outline" className="gap-2">
                <Play className="h-4 w-4" /> Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes */}
      {movie.status === "now-showing" && (
        <div className="container px-4 py-8" id="showtimes">
          <h2 className="text-2xl font-bold mb-6">Showtimes</h2>
          
          {dates.length > 0 ? (
            <Tabs defaultValue={dates[0]} className="w-full">
              <TabsList className="mb-6 overflow-auto flex-nowrap">
                {dates.map((date) => (
                  <TabsTrigger key={date} value={date}>
                    {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {dates.map((date) => (
                <TabsContent key={date} value={date} className="mt-0">
                  {Object.keys(showtimesByDate[date]).map((cinemaId) => {
                    const cinema = cinemas.find((c) => c.id === cinemaId);
                    return (
                      <Card key={cinemaId} className="mb-6">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{cinema?.name}</h3>
                              <p className="text-sm text-muted-foreground">{cinema?.address}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {cinema?.amenities.map((amenity) => (
                                <Badge key={amenity} variant="outline">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <div className="flex flex-wrap gap-3 mt-2">
                                {showtimesByDate[date][cinemaId].map((showtime) => (
                                  <Button
                                    key={showtime.id}
                                    variant="outline"
                                    className="flex flex-col items-center"
                                    asChild
                                  >
                                    <Link href={`/booking/${movie.id}/seats?showtimeId=${showtime.id}`}>
                                      <span className="text-sm">{showtime.time}</span>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {showtime.hall} • {formatCurrency(showtime.price)}
                                      </span>
                                    </Link>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No showtimes available at the moment.</p>
              <p className="text-sm">Please check back later or contact customer service for assistance.</p>
            </div>
          )}
        </div>
      )}

      {/* Trailers & Media */}
      <div className="container px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Trailers & Media</h2>
        
        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Video className="h-12 w-12 text-muted-foreground" />
              <span className="text-muted-foreground">Trailer preview</span>
              <Button className="gap-2">
                <Play className="h-4 w-4" /> Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      <div className="container px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies
            .filter((m) => m.id !== movie.id && m.genre.some((g) => movie.genre.includes(g)))
            .slice(0, 4)
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
                        {movie.status === "now-showing" ? (
                          <Button size="sm\" asChild>
                            <Link href={`/booking/${movie.id}`}>
                              Buy Tickets
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Coming Soon
                          </Button>
                        )}
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {movie.status === "coming-soon" && (
                    <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate mb-1">
                    <Link href={`/movies/${movie.id}`} className="hover:text-primary">
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
      </div>
    </div>
  );
}