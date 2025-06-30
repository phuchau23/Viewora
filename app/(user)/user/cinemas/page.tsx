"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBranch } from "@/hooks/useBranch";
import { useShowtimesByBranchId } from "@/hooks/useShowTime";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to extract city/region from address
function extractLocation(address: string): string {
  const parts = address.split(",");
  return parts[parts.length - 1]?.trim() || "Unknown";
}

// Helper function to format date/time
function formatDateTime(dateTime: string): string {
  return new Date(dateTime).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function CinemasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [openBranchId, setOpenBranchId] = useState<string | null>(null);

  // Fetch branches
  const { branches, isLoading, error } = useBranch();

  // Fetch showtimes for the currently open branch
  const {
    showtimes,
    isLoading: isShowtimesLoading,
    error: showtimesError,
  } = useShowtimesByBranchId(openBranchId);

  // Debug: Log showtimes data with branch details
  useEffect(() => {
    if (openBranchId) {
      const branch = branches.find((b) => b.id === openBranchId);
      console.log("Branch ID:", openBranchId);
      console.log("Branch Name:", branch?.name);
      console.log("Branch Rooms:", branch?.totalRoom);
      console.log("Showtimes:", showtimes);
      console.log("Showtimes Error:", showtimesError);
      console.log("Showtimes Count:", showtimes?.length);
      showtimes?.forEach((s, index) =>
        console.log(`Showtime ${index + 1}:`, {
          id: s.id,
          movie: s.movie.name,
          room: s.room.roomNumber,
          startTime: s.startTime,
          isExpired: s.isExpired,
          status: s.movie.status,
        })
      );
    }
  }, [openBranchId, showtimes, showtimesError, branches]);

  // Filter out inactive branches
  const activeBranches = branches.filter(
    (branch) => branch.status === "Active"
  );

  // Get all unique locations
  const locations = Array.from(
    new Set(activeBranches.map((branch) => extractLocation(branch.address)))
  ).sort();

  // Filter branches
  let filteredBranches = [...activeBranches];
  if (searchQuery) {
    filteredBranches = filteredBranches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedLocation) {
    filteredBranches = filteredBranches.filter(
      (branch) => extractLocation(branch.address) === selectedLocation
    );
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Cinemas</h1>

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
            <Select
              value={selectedLocation ?? undefined}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Loading cinema list...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">
              Error loading cinema list: {error.message || "Unknown error"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4 mt-4">
            {filteredBranches.map((branch) => {
              const branchName = branch.name || "Unknown Branch";
              const isOpen = openBranchId === branch.id;

              return (
                <Card key={branch.id} className="overflow-hidden">
                  <div
                    className="flex flex-col md:flex-row items-start cursor-pointer"
                    onClick={() =>
                      setOpenBranchId(
                        branch.id === openBranchId ? null : branch.id
                      )
                    }
                  >
                    <div className="relative w-full md:w-1/4 aspect-video">
                      <Image
                        src={branch.imageUrl || "/fallback-branch.jpg"}
                        alt={branchName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/fallback-branch.jpg";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 p-4">
                        <Badge className="bg-primary/90 hover:bg-primary">
                          {extractLocation(branch.address)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{branchName}</h3>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <p className="text-muted-foreground">
                          {branch.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-muted-foreground text-sm">
                          Phone: {branch.phoneNumber}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Rooms: {branch.totalRoom}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                  {isOpen && (
                    <div className="p-6 border-t bg-muted/50">
                      <h4 className="font-semibold text-lg mb-4">
                        Current Movies at {branchName}
                      </h4>
                      {isShowtimesLoading && (
                        <p className="text-muted-foreground">
                          Loading movie list...
                        </p>
                      )}
                      {showtimesError && (
                        <p className="text-muted-foreground">
                          No showtimes available for this cinema at the moment.
                        </p>
                      )}
                      {!isShowtimesLoading &&
                      !showtimesError &&
                      showtimes.length > 0 ? (
                        <div className="space-y-4">
                          {showtimes.map((showtime) => (
                            <div key={showtime.id} className="border-b pb-2">
                              <h5 className="font-semibold">
                                {showtime.movie.name}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Showtime: {formatDateTime(showtime.startTime)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Room: {showtime.room.roomNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Duration: {showtime.movie.duration} minutes
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !isShowtimesLoading &&
                        !showtimesError && (
                          <p className="text-muted-foreground">
                            No movies currently showing.
                          </p>
                        )
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && !error && filteredBranches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No cinemas found matching the search criteria.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
