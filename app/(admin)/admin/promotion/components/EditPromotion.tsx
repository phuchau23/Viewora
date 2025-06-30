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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Promotion, PromotionService } from "@/lib/api/service/fetchPromotion";
import { toast } from "sonner";

interface EditPromotionProps {
  promotionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Utilities
const formatVND = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const normalizeDateTime = (dateString?: string): string => {
  if (!dateString) return "";
  let date = new Date(dateString);
  if (
    isNaN(date.getTime()) &&
    dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  ) {
    date = new Date(`${dateString}:00`);
  }
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
};

const formatForServer = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

export function EditPromotion({
  promotionId,
  open,
  onOpenChange,
}: EditPromotionProps) {
  const queryClient = useQueryClient();

  const {
    data: promotion,
    isLoading,
    isError,
    error,
  } = useQuery<Promotion>({
    queryKey: ["promotion", promotionId],
    queryFn: async () => {
      const response = await PromotionService.getPromotionById(promotionId);
      return response.data;
    },
    enabled: !!promotionId,
  });

  const { data: discountTypesResponse, isLoading: isLoadingDiscountTypes } =
    useQuery({
      queryKey: ["discountTypes"],
      queryFn: () => PromotionService.getDiscountTypes(1, 100),
      select: (data) => data.data.items,
    });

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState("0");
  const [discountTypeEnum, setDiscountTypeEnum] = useState("Fixed");
  const [maxDiscountValue, setMaxDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [discountUserNum, setDiscountUserNum] = useState("");
  const [discountTypeId, setDiscountTypeId] = useState("none");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  useEffect(() => {
    if (promotion) {
      setTitle(promotion.title || "");
      setCode(promotion.code || "");
      setDiscountPrice(promotion.discountPrice?.toString() || "0");
      setDiscountTypeEnum(
        promotion.discountTypeEnum === "Percent" ? "Percent" : "Fixed"
      );
      setMaxDiscountValue(promotion.maxDiscountValue?.toString() || "");
      setMinOrderValue(promotion.minOrderValue?.toString() || "");
      setDiscountUserNum(promotion.discountUserNum?.toString() || "");
      setDiscountTypeId(promotion.discountTypeId?.id ?? "none");
      setStartTime(normalizeDateTime(promotion.startTime));
      setEndTime(normalizeDateTime(promotion.endTime));
      setImagePreview(promotion.image || null);
    }
  }, [promotion]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async () => {
    if (!title || !code || !discountPrice || !discountTypeEnum) {
      toast.error("Please fill all required fields");
      return;
    }

    if (endTime && startTime && new Date(endTime) <= new Date(startTime)) {
      toast.error("End Time must be after Start Time");
      return;
    }

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Code", code);
    formData.append("DiscountPrice", discountPrice);
    formData.append("StartTime", formatForServer(startTime));
    formData.append("EndTime", formatForServer(endTime));
    formData.append("DiscountTypeEnum", discountTypeEnum);
    if (discountTypeId !== "none")
      formData.append("DiscountTypeId", discountTypeId);
    formData.append("MaxDiscountValue", maxDiscountValue || "");
    formData.append("MinOrderValue", minOrderValue || "");
    formData.append("DiscountUserNum", discountUserNum || "");
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (promotion?.image) {
      formData.append("imageUrl", promotion.image);
    }

    try {
      setIsSubmitting(true);
      const res = await PromotionService.updatePromotion(promotionId, formData);
      toast.success(res.message || "Promotion updated successfully");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
          <DialogDescription>
            Update the details of the promotion.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p>Loading promotion data...</p>
        ) : isError || !promotion ? (
          <p>Error: {error?.message || "Could not load promotion"}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Promotion Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label>Code</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div>
                <Label>Discount Price</Label>
                <Input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Discount Type</Label>
                <Select
                  value={discountTypeEnum}
                  onValueChange={setDiscountTypeEnum}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Percent">Percent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startTime.slice(0, 10)}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endTime.slice(0, 10)}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div>
                <Label>Max Discount Value</Label>
                <Input
                  type="number"
                  value={maxDiscountValue}
                  onChange={(e) => setMaxDiscountValue(e.target.value)}
                />
              </div>
              <div>
                <Label>Min Order Value</Label>
                <Input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                />
              </div>
              <div>
                <Label>Discount User Number</Label>
                <Input
                  type="number"
                  value={discountUserNum}
                  onChange={(e) => setDiscountUserNum(e.target.value)}
                />
              </div>
              <div>
                <Label>Discount Type (Optional)</Label>
                <Select
                  value={discountTypeId}
                  onValueChange={setDiscountTypeId}
                  disabled={isLoadingDiscountTypes}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDiscountTypes
                          ? "Loading..."
                          : "Select discount type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {discountTypesResponse?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Image</Label>
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
                    alt="Promotion preview"
                    className="w-32 mt-2 rounded border cursor-pointer"
                    onClick={() => setPreviewModal(true)}
                  />
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
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
              className="relative max-w-3xl w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-blue-100 z-10"
                onClick={() => setPreviewModal(false)}
              >
                <span className="text-xl font-bold text-gray-700">×</span>
              </button>
              <img
                src={imagePreview}
                alt="Promotion preview"
                className="rounded-md object-contain max-h-[80vh] w-auto"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
