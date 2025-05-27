"use client";

import React, { useState, useEffect } from 'react';

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Info, Clock, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { movies, cinemas, showtimes, formatCurrency, formatDuration } from "@/lib/data";

// Seat types
type SeatStatus = "available" | "selected" | "reserved";

type Seat = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: "standard" | "vip" | "couple";
  price: number;
};

// Generate demo seats
const generateSeats = (showtimeId: string): Seat[] => {
  const showtime = showtimes.find((s) => s.id === showtimeId);
  const basePrice = showtime?.price || 100000;
  
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const seats: Seat[] = [];
  
  // Random seed for reserved seats
  const reservedSeats = new Set();
  for (let i = 0; i < 20; i++) {
    const row = rows[Math.floor(Math.random() * rows.length)];
    const number = Math.floor(Math.random() * seatsPerRow) + 1;
    reservedSeats.add(`${row}${number}`);
  }
  
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      // Skip aisle
      if (i === 4 || i === 9) continue;
      
      const id = `${row}${i}`;
      let type: Seat["type"] = "standard";
      let price = basePrice;
      
      // Make some rows VIP
      if (row === "F" || row === "G") {
        type = "vip";
        price = basePrice * 1.5;
      }
      
      // Make some seats couple seats
      if (row === "H" && (i === 5 || i === 6 || i === 7 || i === 8)) {
        type = "couple";
        price = basePrice * 2;
      }
      
      seats.push({
        id,
        row,
        number: i,
        status: reservedSeats.has(id) ? "reserved" : "available",
        type,
        price,
      });
    }
  });
  
  return seats;
};

export default function SeatSelectionPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get("showtimeId");
  
  const movie = movies.find((m) => m.id === id as string);
  const showtime = showtimes.find((s) => s.id === showtimeId);
  const cinema = cinemas.find((c) => c.id === showtime?.cinemaId);
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  useEffect(() => {
    if (showtimeId) {
      setSeats(generateSeats(showtimeId));
    }
  }, [showtimeId]);
  
  if (!movie || !showtime || !cinema) {
    return (
      <div className="container px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Information Not Found</h1>
        <p className="text-muted-foreground mb-6">The booking information you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/movies">Back to Movies</Link>
        </Button>
      </div>
    );
  }
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "reserved") return;
    
    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/movies/${movie.id}`}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Select Seats</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-12 relative rounded overflow-hidden">
                    <Image
                      src={movie.image}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{movie.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(movie.duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{cinema.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(showtime.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {" • "}
                    {showtime.time}
                    {" • "}
                    {showtime.hall}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-secondary"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-primary"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-muted-foreground"></div>
                  <span>Reserved</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm border border-secondary bg-secondary/20"></div>
                  <span>Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm border border-amber-500 bg-amber-500/20"></div>
                  <span>VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm border border-pink-500 bg-pink-500/20"></div>
                  <span>Couple</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8 overflow-x-auto">
              <div className="w-full min-w-[500px]">
                <div className="relative w-full mb-8">
                  <div className="h-8 bg-secondary/50 rounded-t-3xl w-4/5 mx-auto"></div>
                  <div className="text-center text-sm text-muted-foreground mt-2">SCREEN</div>
                </div>
                
                <div className="space-y-4">
                  {Object.keys(seatsByRow).map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <div className="w-8 text-center font-semibold">{row}</div>
                      <div className="flex gap-1 flex-1 justify-center">
                        {seatsByRow[row].map((seat) => {
                          const isSelected = selectedSeats.some((s) => s.id === seat.id);
                          let borderColor = "border-secondary";
                          let bgColor = "bg-secondary";
                          
                          if (seat.type === "vip") {
                            borderColor = "border-amber-500";
                            bgColor = isSelected ? "bg-primary" : "bg-amber-500/20";
                          } else if (seat.type === "couple") {
                            borderColor = "border-pink-500";
                            bgColor = isSelected ? "bg-primary" : "bg-pink-500/20";
                          } else {
                            bgColor = isSelected ? "bg-primary" : "bg-secondary";
                          }
                          
                          return (
                            <button
                              key={seat.id}
                              className={`
                                w-7 h-7 rounded-t-sm flex items-center justify-center text-xs
                                ${seat.status === "reserved" ? "bg-muted-foreground cursor-not-allowed" : `border ${borderColor} ${bgColor} hover:opacity-80 cursor-pointer`}
                                ${seat.type === "couple" ? "w-16" : ""}
                              `}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status === "reserved"}
                            >
                              {seat.type === "couple" ? `${seat.row}${seat.number}-${seat.number+1}` : seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <div className="w-8 text-center font-semibold">{row}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Movie</h3>
                    <p>{movie.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1">Cinema</h3>
                    <p>{cinema.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1">Showtime</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(showtime.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{showtime.time} • {showtime.hall}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Selected Seats</h3>
                    {selectedSeats.length > 0 ? (
                      <div className="space-y-2">
                        {selectedSeats.map((seat) => (
                          <div key={seat.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                seat.type === "vip" 
                                  ? "outline" 
                                  : seat.type === "couple" 
                                    ? "secondary" 
                                    : "default"
                              }>
                                {seat.row}{seat.number}
                              </Badge>
                              <span className="text-sm text-muted-foreground capitalize">
                                {seat.type} Seat
                              </span>
                            </div>
                            <span>{formatCurrency(seat.price)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm">No seats selected</p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={selectedSeats.length === 0}>
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-4 bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Tickets once purchased cannot be exchanged or refunded.</p>
                  <p>Please arrive at least 15 minutes before the movie starts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}