"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export default function MoviesTables() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [movies, setMovies] = useState([
    {
      movieId: 1,
      name: "Sample Movie",
      description: "A sample movie description",
      dateCreate: new Date(),
      status: true,
    },
  ]);
  const [editMovieId, setEditMovieId] = useState(null);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newMovie = {
      movieId: movies.length + 1,
      name: formData.name,
      description: formData.description,
      dateCreate: new Date(),
      status: true,
    };
    setMovies([...movies, newMovie]);
    setFormData({ name: "", description: "" });
    setIsCreateOpen(false);
  };

  const handleEdit = (movie) => {
    setFormData({ name: movie.name, description: movie.description });
    setEditMovieId(movie.movieId);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    setMovies(
      movies.map((movie) =>
        movie.movieId === editMovieId
          ? { ...movie, name: formData.name, description: formData.description }
          : movie
      )
    );
    setFormData({ name: "", description: "" });
    setIsEditOpen(false);
    setEditMovieId(null);
  };

  const handleDelete = (movieId) => {
    setMovies(movies.filter((movie) => movie.movieId !== movieId));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movies Management</CardTitle>
          <CardDescription>Manage movies for your application</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Movies Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchTerm
                        ? "No movies found matching your search."
                        : "No movies available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovies.map((movie) => (
                    <TableRow key={movie.movieId}>
                      <TableCell>{movie.name}</TableCell>
                      <TableCell>{movie.description}</TableCell>
                      <TableCell>
                        {new Date(movie.dateCreate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={movie.status ? "default" : "secondary"}>
                          {movie.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(movie)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold text-red-600">
                                  Delete Movie
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                                  Are you sure you want to delete the movie{" "}
                                  <strong className="text-black">
                                    "{movie.name}"
                                  </strong>
                                  ? <br />
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                                <AlertDialogCancel asChild>
                                  <Button variant="outline">Cancel</Button>
                                </AlertDialogCancel>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(movie.movieId)}
                                >
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Movie</DialogTitle>
                <DialogDescription>
                  Update the movie details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Movie Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter movie name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={!formData.name.trim()}
                >
                  Update Movie
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}