"use client";

import { useState } from "react";
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
import { useTranslation } from "react-i18next";

function extractLocation(address: string): string {
  const parts = address.split(",");
  return parts[parts.length - 1]?.trim() || "Unknown";
}

function formatDateTime(dateTime: string): string {
  return new Date(dateTime).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function CinemasPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [openBranchId, setOpenBranchId] = useState<string | null>(null);

  const { branches, isLoading, error } = useBranch();
  const {
    showtimes,
    isLoading: isShowtimesLoading,
    error: showtimesError,
  } = useShowtimesByBranchId(openBranchId);

  const activeBranches = branches.filter(
    (branch) => branch.status === "Active"
  );
  const locations = Array.from(
    new Set(activeBranches.map((branch) => extractLocation(branch.address)))
  ).sort();

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
        <h1 className="text-3xl font-bold">{t("cinemas.title")}</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("cinemas.searchPlaceholder")}
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
              {t("cinemas.allLocations")}
            </Button>
            <Select
              value={selectedLocation ?? undefined}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("cinemas.locations")} />
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
            <p className="text-muted-foreground">{t("cinemas.loading")}</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">
              {t("cinemas.error")}: {error.message || "Unknown error"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              {t("cinemas.retry")}
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4 mt-4">
            {filteredBranches.map((branch) => {
              const branchName = branch.name || t("cinemas.unknownBranch");
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
                          {t("cinemas.phone")}: {branch.phoneNumber}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {t("cinemas.rooms")}: {branch.totalRoom}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                  {isOpen && (
                    <div className="p-6 border-t bg-muted/50">
                      <h4 className="font-semibold text-lg mb-4">
                        {t("cinemas.currentMovies", { branch: branchName })}
                      </h4>
                      {isShowtimesLoading && (
                        <p className="text-muted-foreground">
                          {t("cinemas.loadingMovies")}
                        </p>
                      )}
                      {showtimesError && (
                        <p className="text-muted-foreground">
                          {t("cinemas.noShowtimes")}
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
                                {t("cinemas.showtime")}:{" "}
                                {formatDateTime(showtime.startTime)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("cinemas.room")}: {showtime.room.roomNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("cinemas.duration")}:{" "}
                                {showtime.movie.duration} {t("cinemas.minutes")}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !isShowtimesLoading &&
                        !showtimesError && (
                          <p className="text-muted-foreground">
                            {t("cinemas.noMovies")}
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
              {t("cinemas.noCinemas")}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation(null);
              }}
            >
              {t("cinemas.clearFilters")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
