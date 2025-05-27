"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cinemas } from "@/lib/data";

export default function CinemasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Get all unique locations
  const locations = Array.from(new Set(cinemas.map((cinema) => cinema.location)));
  
  // Filter cinemas
  let filteredCinemas = [...cinemas];
  
  if (searchQuery) {
    filteredCinemas = filteredCinemas.filter(
      (cinema) =>
        cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cinema.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedLocation) {
    filteredCinemas = filteredCinemas.filter(
      (cinema) => cinema.location === selectedLocation
    );
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Our Cinemas</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cinemas..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedLocation === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLocation(null)}
            >
              All Locations
            </Button>
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredCinemas.map((cinema) => (
            <Card key={cinema.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={cinema.image}
                  alt={cinema.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 p-4">
                  <Badge className="bg-primary/90 hover:bg-primary">
                    {cinema.location}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{cinema.name}</h3>
                
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-muted-foreground">{cinema.address}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {cinema.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                
                <Button asChild>
                  <Link href={`/cinemas/${cinema.id}`}>View Showtimes</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredCinemas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No cinemas found matching your search criteria.</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedLocation(null);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}