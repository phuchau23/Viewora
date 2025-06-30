"use client";

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
import PaginationControls from "@/components/shared/PaginationControl";
import type { Movies } from "@/lib/api/service/fetchMovies";
import type { Type } from "@/lib/api/service/fetchTypes";

export default function MoviesTables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);

  const { movies, isLoading, isError, error, totalPages } = useMovies(
    pageIndex,
    pageSize
  );

  const { deleteMovie } = useDeleteMovie();
  const { playMovie } = usePlayMovie();
  const { stopMovie } = useStopMovie();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const { sortConfig, handleSort, sortedData } = useSort([
    "name",
    "director",
    "duration",
    "status",
    "isAvailable",
  ]);

  const searchedMovies = useMemo(() => {
    const safeMovies = movies ?? [];
    if (!searchTerm) return safeMovies;

    return safeMovies.filter((movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

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
        <p>Lỗi: {error?.message || "Đã xảy ra lỗi khi tải phim."}</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá phim này không?")) {
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

  return (
    <div className="mx-2 space-y-6">
      {/* Filter and Create */}
      <Card>
        <CardHeader>
          <CardTitle>Movies Management</CardTitle>
          <CardDescription>Manage movies for your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <CreateModal />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>Poster</TableHead>
              <TableHead onClick={() => handleSort("name")}>
                Tên phim{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Thể loại</TableHead>
              <TableHead onClick={() => handleSort("director")}>
                Đạo diễn{" "}
                {sortConfig.key === "director" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("duration")}>
                Thời lượng{" "}
                {sortConfig.key === "duration" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("isAvailable")}>
                isAvailable{" "}
                {sortConfig.key === "isAvailable" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("status")}>
                Trạng thái{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies?.map((movie) => (
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
                <TableCell>{movie.duration} phút</TableCell>
                <TableCell>{movie.isAvailable ? "Có" : "Không"}</TableCell>
                <TableCell>{movie.status}</TableCell>
                <TableCell className="px-0">
                  <div className="w-fit mx-auto flex gap-2">
                    {/* Edit: chỉ hiển thị nếu không phải ended */}
                    {movie.status !== "Ended" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(movie)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}

                    {/* Delete: luôn hiển thị */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(movie.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                    {/* Play: chỉ hiển thị nếu là inComing */}
                    {movie.status === "inComing" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlay(movie.id, movie.status)}
                      >
                        <Play className="w-4 h-4 text-green-500" />
                      </Button>
                    )}

                    {/* Stop: chỉ hiển thị nếu là nowShowing */}
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

      {/* Pagination */}
      <PaginationControls
        currentPage={pageIndex}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={(page) => setPageIndex(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(1);
        }}
      />

      {/* Modal */}
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
