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
import { usePromotions, useDeletePromotion } from "@/hooks/usePromotions";
import { Pencil, Search, Trash2, Download } from "lucide-react";
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
import { formatVND } from "@/utils/price/formatPrice";
import Image from "next/image";
import { exportToCSV } from "@/utils/export/exportToCSV";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PromotionCreateDialog } from "./CreatePromotion";
import { EditPromotion } from "./EditPromotion";
import { useTranslation } from "react-i18next";

export default function PromotionsTables() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const pageSize = 10;
  const { data, isLoading, isError, error } = usePromotions(
    pageIndex,
    pageSize
  );
  const { deletePromotion, isDeleting } = useDeletePromotion();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const { sortConfig, handleSort, sortedData } = useSort([
    "title",
    "code",
    "discountPrice",
    "startTime",
    "endTime",
    "statusActive",
  ]);

  const promotions = data?.promotions || [];
  const searchedPromotions = useMemo(() => {
    if (!searchTerm) return promotions;
    return promotions.filter(
      (promo) =>
        promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [promotions, searchTerm]);

  const sortedPromotions = sortedData(searchedPromotions);

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
        <p>{t("pro.error", { message: error?.message || "" })}</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    toast(
      <div>
        <div className="font-semibold mb-2">{t("pro.deleteConfirm")}</div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              deletePromotion(id, {
                onSuccess: () => {
                  toast.success(t("pro.deleteSuccess"), {
                    duration: 4000,
                    position: "top-right",
                  });
                  queryClient.invalidateQueries({ queryKey: ["promotions"] });
                },
                onError: (error: any) => {
                  toast.error(error.message || t("pro.deleteFailed"), {
                    duration: 4000,
                    position: "top-right",
                  });
                },
              });
              toast.dismiss();
            }}
            disabled={isDeleting}
          >
            {t("pro.delete")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
            {t("pro.cancel")}
          </Button>
        </div>
      </div>,
      {
        duration: 8000,
        position: "top-right",
      }
    );
  };

  const handleEdit = (promotion: any) => {
    setSelectedPromotionId(promotion.id);
    setIsEditModalOpen(true);
  };

  const handleExport = () => {
    if (!sortedPromotions.length) {
      toast.error(t("pro.noExport"));
      return;
    }

    exportToCSV(
      "promotions.csv",
      [
        t("pro.title"),
        t("pro.code"),
        t("pro.discount"),
        t("pro.start"),
        t("pro.end"),
        t("pro.status"),
        t("pro.discountType"),
      ],
      sortedPromotions,
      (promo) => [
        promo.title,
        promo.code,
        promo.discountTypeEnum === "Percent"
          ? `${promo.discountPrice}%`
          : formatVND(promo.discountPrice),
        new Date(promo.startTime).toLocaleDateString(),
        new Date(promo.endTime).toLocaleDateString(),
        promo.statusActive,
        promo.discountTypeId?.name || t("pro.none"),
      ]
    );
  };

  return (
    <div className="mx-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("pro.titlePage")}</CardTitle>
          <CardDescription>{t("pro.descriptionPage")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("pro.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.slice(0, 28))}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                {t("pro.export")}
              </Button>
              <PromotionCreateDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("pro.image")}</TableHead>
              <TableHead onClick={() => handleSort("title")}>
                {t("pro.title")}{" "}
                {sortConfig.key === "title" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("code")}>
                {t("pro.code")}{" "}
                {sortConfig.key === "code" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("discountPrice")}>
                {t("pro.discount")}{" "}
                {sortConfig.key === "discountPrice" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("startTime")}>
                {t("pro.start")}{" "}
                {sortConfig.key === "startTime" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("endTime")}>
                {t("pro.end")}{" "}
                {sortConfig.key === "endTime" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>{t("pro.discountType")}</TableHead>
              <TableHead onClick={() => handleSort("statusActive")}>
                {t("pro.status")}{" "}
                {sortConfig.key === "statusActive" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>{t("pro.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPromotions.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell>
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    width={50}
                    height={50}
                    className="border rounded object-cover cursor-pointer"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    onClick={() => setPreviewImage(promo.image)}
                  />
                </TableCell>
                <TableCell className="font-bold">{promo.title}</TableCell>
                <TableCell>{promo.code}</TableCell>
                <TableCell>
                  {promo.discountTypeEnum === "Percent"
                    ? `${promo.discountPrice}%`
                    : formatVND(promo.discountPrice)}
                </TableCell>
                <TableCell>
                  {new Date(promo.startTime).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(promo.endTime).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {promo.discountTypeId?.name || t("pro.none")}
                </TableCell>
                <TableCell>{promo.statusActive}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(promo)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(promo.id)}
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

      {selectedPromotionId && (
        <EditPromotion
          promotionId={selectedPromotionId}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-10"
              onClick={() => setPreviewImage(null)}
            >
              <span className="text-xl font-bold text-gray-700">×</span>
            </button>
            <img
              src={previewImage}
              alt={t("pro.preview")}
              className="rounded-xl object-contain max-h-[80vh] w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
