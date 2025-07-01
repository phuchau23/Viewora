"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Snack } from "@/lib/api/service/fetchSnack";
import AddSnackDialog from "./AddSnack";
import EditSnackDialog from "./EditSnack";
import { exportToCSV } from "@/utils/export/exportToCSV";
import { useDeleteSnack, useSnacks } from "@/hooks/useSnacks";
import { useSort } from "@/hooks/useSort";
import { formatVND } from "@/utils/price/formatPrice";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function SnacksTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex] = useState(1);
  const pageSize = 10;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data, isLoading, isError, error } = useSnacks(pageIndex, pageSize);
  const { deleteSnack, isDeleting } = useDeleteSnack();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSnackId, setSelectedSnackId] = useState<string | null>(null);

  const { sortConfig, handleSort, sortedData } = useSort([
    "name",
    "price",
    "isAvailable",
  ]);

  const snacks = data?.snacks || [];

  const searchedSnacks = useMemo(() => {
    if (!searchQuery) return snacks;
    return snacks.filter((snack) =>
      snack.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [snacks, searchQuery]);

  const sortedSnacks = sortedData(searchedSnacks);

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
        <p className="text-red-500">
          Lỗi: {error?.message || "Không thể tải dữ liệu snack"}
        </p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    toast(
      <div>
        <div className="font-semibold mb-2">
          Are you sure you want to delete this snack?
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              deleteSnack(id, {
                onSuccess: () => {
                  toast.success("Snack deleted successfully!");
                  queryClient.invalidateQueries({ queryKey: ["snacks"] });
                },
                onError: (error: any) => {
                  toast.error(error.message || "Failed to delete snack");
                },
              });
              toast.dismiss();
            }}
            disabled={isDeleting}
          >
            Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
            Cancel
          </Button>
        </div>
      </div>,
      { duration: 8000 }
    );
  };

  const handleEdit = (snack: Snack) => {
    setSelectedSnackId(snack.id);
    setIsEditModalOpen(true);
  };

  const handleExport = () => {
    if (!sortedSnacks.length) {
      toast.error("No snacks to export");
      return;
    }

    exportToCSV(
      "snacks.csv",
      ["Name", "Price", "Status"],
      sortedSnacks,
      (snack) => [
        snack.name,
        formatVND(snack.price),
        snack.isAvailable ? "Available" : "Unavailable",
      ]
    );
  };

  return (
    <div className="mx-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Snack Management</CardTitle>
          <CardDescription>Manage snacks for your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên snack"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.slice(0, 28))}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <AddSnackDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead onClick={() => handleSort("name")}>
                Tên{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("price")}>
                Giá{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("isAvailable")}>
                Trạng thái{" "}
                {sortConfig.key === "isAvailable" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSnacks.map((snack) => (
              <TableRow key={snack.id}>
                <TableCell>
                  <Image
                    src={snack.image}
                    alt={snack.name}
                    width={50}
                    height={50}
                    className="border rounded object-cover cursor-pointer"
                    onClick={() => setPreviewImage(snack.image)}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </TableCell>
                <TableCell className="font-bold">{snack.name}</TableCell>
                <TableCell>{formatVND(snack.price)}</TableCell>
                <TableCell>
                  {snack.isAvailable ? "Available" : "Unavailable"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(snack)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(snack.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedSnackId && (
        <EditSnackDialog
          snackId={selectedSnackId}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}

      {previewImage && (
        <Dialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
        >
          <DialogContent className="max-w-3xl">
            <div className="w-full flex justify-center">
              <Image
                src={previewImage}
                alt="Preview"
                width={600}
                height={600}
                className="rounded object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
