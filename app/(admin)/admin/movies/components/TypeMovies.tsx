"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetTypes, useCreateType, useDeleteType } from "@/hooks/useTypes";
import { Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

export function TypeMovies() {
  const [newType, setNewType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    types,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
    error: errorTypes,
  } = useGetTypes();
  const {
    createType,
    isLoading: isCreating,
    error: errorCreate,
  } = useCreateType();
  const {
    deleteType,
    isLoading: isDeleting,
    error: errorDelete,
  } = useDeleteType();

  const handleAdd = () => {
    if (newType.trim()) {
      createType(
        { name: newType },
        {
          onSuccess: () => {
            setNewType("");
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteType(id);
  };

  if (isLoadingTypes) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (isErrorTypes) {
    return <div>Lỗi khi tải dữ liệu: {errorTypes}</div>;
  }

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
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="text-center">Tên Loại Phim</TableHead>
                <TableHead className="text-center">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types?.data?.map((type) => (
                <TableRow key={type.id} className="text-center">
                  <TableCell className="text-center">{type.name}</TableCell>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-semibold text-red-600">
                            Delete Type
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                            Are you sure you want to delete the type{" "}
                            <strong className="text-black">
                              "{type.name}"
                            </strong>
                            ? <br />
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 flex justify-center gap-2">
                          <AlertDialogCancel asChild>
                            <Button variant="outline">Cancel</Button>
                          </AlertDialogCancel>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(type.id)}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {errorDelete && (
            <div className="text-red-500 mt-4">{errorDelete}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
