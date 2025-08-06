import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  useMovies,
  useDeleteMovie,
  usePlayMovie,
  useStopMovie,
} from "@/hooks/useMovie";
import { Pencil, Play, Search, StopCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSort } from "@/hooks/useSort";
import { CreateModal } from "./CreateModal";
import { EditMovieModal } from "./EditModal";
import type { Movies } from "@/lib/api/service/fetchMovies";
import { useTranslation } from "react-i18next";

export default function MoviesTables() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { movies, isLoading, isError, error } = useMovies();
  const { deleteMovie } = useDeleteMovie();
  const { playMovie } = usePlayMovie();
  const { stopMovie } = useStopMovie();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const { sortConfig, handleSort } = useSort([
    "name",
    "director",
    "duration",
    "status",
    "isAvailable",
  ]);

  const filteredMovies = useMemo(() => {
    let safeMovies = movies ?? [];
    if (searchTerm) {
      safeMovies = safeMovies.filter((movie) =>
        movie.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    safeMovies = safeMovies.filter((movie) => movie.isAvailable === true);
    return safeMovies;
  }, [movies, searchTerm]);

  const sortedMovies = useMemo(() => {
    if (!sortConfig.key) return filteredMovies;
    const sorted = [...filteredMovies].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Movies];
      const bValue = b[sortConfig.key as keyof Movies];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredMovies, sortConfig]);

  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMovies.slice(start, start + pageSize);
  }, [sortedMovies, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  const handleDelete = (id: string) => {
    if (confirm(t("movie.confirmDelete"))) {
      deleteMovie(id);
    }
  };

  const handleEdit = (movie: Movies) => {
    setSelectedMovieId(movie.id);
    setIsEditModalOpen(true);
  };

  const handlePlay = (id: string, currentStatus: string) => {
    if (["inComing", "ended"].includes(currentStatus)) {
      playMovie(id);
    }
  };

  const handleStop = (id: string, currentStatus: string) => {
    if (currentStatus === "nowShowing") {
      stopMovie(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-32 mb-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <p>
          {t("movie.error")}: {error?.message || t("movie.errorDefault")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("movie.managementTitle")}</CardTitle>
          <CardDescription>{t("movie.managementDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("movie.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <CreateModal />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>{t("movie.poster")}</TableHead>
              <TableHead onClick={() => handleSort("name")}>
                {t("movie.name")}
              </TableHead>
              <TableHead>{t("movie.type")}</TableHead>
              <TableHead onClick={() => handleSort("director")}>
                {t("movie.director")}
              </TableHead>
              <TableHead onClick={() => handleSort("duration")}>
                {t("movie.duration")}
              </TableHead>
              <TableHead onClick={() => handleSort("status")}>
                {t("movie.status")}
              </TableHead>
              <TableHead>{t("movie.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMovies.map((movie) => (
              <TableRow key={movie.id} className="hover:bg-secondary">
                <TableCell>
                  <img
                    src={movie.poster}
                    alt={movie.name}
                    width={50}
                    className="border rounded"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </TableCell>
                <TableCell className="font-bold">{movie.name}</TableCell>
                <TableCell>
                  {movie.movieTypes.map((t) => t.name).join(", ")}
                </TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>
                  {movie.duration} {t("movie.minutes")}
                </TableCell>
                <TableCell>{movie.status}</TableCell>
                <TableCell className="px-0">
                  <div className="w-fit mx-auto flex gap-2">
                    {movie.status !== "Ended" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(movie)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(movie.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    {movie.status === "inComing" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlay(movie.id, movie.status)}
                      >
                        <Play className="w-4 h-4 text-green-500" />
                      </Button>
                    )}
                    {movie.status === "nowShowing" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStop(movie.id, movie.status)}
                      >
                        <StopCircle className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <div>
          {t("pagination.page")} {currentPage} / {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            {t("pagination.prev")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>

      {selectedMovieId && (
        <EditMovieModal
          movieId={selectedMovieId}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
    </div>
  );
}
