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
import { Plus, Search, Trash2, X } from "lucide-react";
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
import { useSort } from "@/hooks/useSort";

export function TypeMovies() {
  const [newType, setNewType] = useState("");
  const { sortConfig, handleSort, sortedData } = useSort(["name"]);

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
  const sortedTypes = sortedData(types?.data || []);


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
    <div className="container py-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 py-2">
        <div className="relative w-72 px-2">
          <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Add type..."
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={handleAdd}>
          Add
        </Button>
      </div>
      {/* Scrollable Table */}
      <div className="max-h-[700px] overflow-y-auto">
        <Table>
          <TableHeader className="text-center">
            <TableRow>
              <TableHead onClick={() => handleSort("name")}>
                Tên Loại Phim{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTypes?.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="text-center">{type.name}</TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold text-red-600">
                          Delete Type
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                          Are you sure you want to delete the type{" "}
                          <strong className="text-black">"{type.name}"</strong>
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
      </div>
    </div>
  );
}
