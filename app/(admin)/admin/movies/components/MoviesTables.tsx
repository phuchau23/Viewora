'use client';

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
import { useMovies } from "@/hooks/useMovie";
import { Pencil, Search, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSort } from '@/hooks/useSort';
import { CreateModal } from "./CreateModal";
import { useDeleteMovie } from '@/hooks/useMovie';

export default function MoviesTables() {
  const { movies, isLoading, error } = useMovies();
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: deleteMovie } = useDeleteMovie();

  // Sử dụng useSort với các trường có thể sắp xếp
  const { sortConfig, handleSort, sortedData } = useSort(['name', 'director', 'duration', 'status', 'isAvailable']);

  // Logic lọc dựa trên searchTerm
  const searchedMovies = useMemo(() => {
    if (!searchTerm) return movies;
    return movies.filter((movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  // Sắp xếp danh sách đã lọc
  const sortedMovies = sortedData(searchedMovies);

  // Xử lý trạng thái loading và lỗi
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-32 mb-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p>Lỗi: {error.message}</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    console.log(id);
    deleteMovie(id);
  };

  return (
    <div className="mx-2 space-y-6">
      {/* Phần lọc */}
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

      {/* Bảng dữ liệu */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
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
            {sortedMovies.map((movie) => (
              <TableRow key={movie.id}>
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
                  {movie.movieTypes.map((type: any) => type.name).join(", ")}
                </TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>{movie.duration} minutes</TableCell>
                <TableCell>{movie.isAvailable ? "Có" : "Không"}</TableCell>
                <TableCell>{movie.status}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(movie.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}