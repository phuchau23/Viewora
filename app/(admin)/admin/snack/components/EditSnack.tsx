"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Snack, SnackService } from "@/lib/api/service/fetchSnack";
import { toast } from "sonner";
import { formatVND } from "@/utils/price/formatPrice";
import { useUpdateSnack } from "@/hooks/useSnacks";
import { useTranslation } from "react-i18next";

interface EditSnackDialogProps {
  snackId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSnackDialog({
  snackId,
  open,
  onOpenChange,
}: EditSnackDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateSnack, isUpdating } = useUpdateSnack();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const {
    data: snack,
    isLoading,
    isError,
    error,
  } = useQuery<Snack>({
    queryKey: ["snack", snackId],
    queryFn: async () => {
      const response = await SnackService.getSnackById(snackId);
      return response.data;
    },
    enabled: !!snackId,
  });

  useEffect(() => {
    if (snack) {
      setName(snack.name || "");
      setPrice(snack.price?.toString() || "");
      setImagePreview(snack.image || null);
    }
  }, [snack]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async () => {
    if (!name || !price) {
      toast.error(t("snackedit.requiredFields"));
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      toast.error(t("snackedit.invalidPrice"));
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Price", price);
    if (imageFile) {
      formData.append("file", imageFile);
      formData.append("imageFile", imageFile);
    } else if (snack?.image) {
      formData.append("imageUrl", snack.image);
    }

    try {
      setIsSubmitting(true);
      await updateSnack({ id: snackId, formData });
      toast.success(t("snackedit.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          t("snackedit.updateFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("snackedit.title")}</DialogTitle>
          <DialogDescription>{t("snackedit.description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p>{t("snackedit.loading")}</p>
        ) : isError || !snack ? (
          <p>{t("snackedit.error", { error: error?.message || "" })}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("snackedit.formTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("snackedit.name")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>{t("snackedit.price")}</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {price && (
                  <p className="text-sm text-gray-500 mt-1">
                    {t("snackedit.previewPrice")}: {formatVND(Number(price))}
                  </p>
                )}
              </div>
              <div>
                <Label>{t("snackedit.image")}</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={t("snackedit.imagePreviewAlt")}
                    className="w-32 mt-2 rounded border cursor-pointer"
                    onClick={() => setPreviewModal(true)}
                  />
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUpdating}
                >
                  {isSubmitting || isUpdating
                    ? t("snackedit.saving")
                    : t("snackedit.save")}
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  {t("snackedit.cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {previewModal && imagePreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setPreviewModal(false)}
          >
            <div
              className="relative max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-10"
                onClick={() => setPreviewModal(false)}
              >
                ×
              </button>
              <img
                src={imagePreview}
                alt={t("snackedit.imagePreviewAlt")}
                className="rounded-xl max-h-[80vh]"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
