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
import { Download, Search, Pencil, Trash2 } from "lucide-react";
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
import { useTranslation } from "react-i18next";

export default function SnacksTable() {
  const { t } = useTranslation();
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
          {t("snack.errorLoad", { error: error?.message || "" })}
        </p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    toast(
      <div>
        <div className="font-semibold mb-2">{t("snack.confirmDelete")}</div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              deleteSnack(id, {
                onSuccess: () => {
                  toast.success(t("snack.deleteSuccess"));
                  queryClient.invalidateQueries({ queryKey: ["snacks"] });
                },
                onError: (error: any) => {
                  toast.error(error.message || t("snack.deleteFailed"));
                },
              });
              toast.dismiss();
            }}
            disabled={isDeleting}
          >
            {t("snack.delete")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
            {t("snack.cancel")}
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
      toast.error(t("snack.noSnackExport"));
      return;
    }

    exportToCSV(
      "snacks.csv",
      [t("snack.exportName"), t("snack.exportPrice"), t("snack.exportStatus")],
      sortedSnacks,
      (snack) => [
        snack.name,
        formatVND(snack.price),
        snack.isAvailable ? t("snack.available") : t("snack.unavailable"),
      ]
    );
  };

  return (
    <div className="mx-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("snack.title")}</CardTitle>
          <CardDescription>{t("snack.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("snack.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.slice(0, 28))}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                {t("snack.export")}
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
              <TableHead>{t("snack.image")}</TableHead>
              <TableHead onClick={() => handleSort("name")}>
                {t("snack.name")}{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("price")}>
                {t("snack.price")}{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("isAvailable")}>
                {t("snack.status")}{" "}
                {sortConfig.key === "isAvailable" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>{t("snack.action")}</TableHead>
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
                  {snack.isAvailable
                    ? t("snack.available")
                    : t("snack.unavailable")}
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
                alt={t("snack.previewImage")}
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
