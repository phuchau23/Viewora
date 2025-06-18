"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Promotion, PromotionService } from "@/lib/api/service/fetchPromotion";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Helper function to parse and normalize date strings
const normalizeDateTime = (dateString?: string): string => {
  if (!dateString) return "";
  // Try parsing the date
  let date = new Date(dateString);
  // If invalid, try appending seconds
  if (
    isNaN(date.getTime()) &&
    dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  ) {
    date = new Date(`${dateString}:00`);
  }
  // Return ISO format for datetime-local (YYYY-MM-DDTHH:mm)
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
};

// Helper function to format date for server (YYYY-MM-DD HH:mm:ss)
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

interface EditPromotionFormProps {
  promotion: Promotion;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function EditPromotionForm({
  promotion,
  onCancel,
  onSuccess,
}: EditPromotionFormProps) {
  const [title, setTitle] = useState(promotion.title || "");
  const [code, setCode] = useState(promotion.code || "");
  const [discountPrice, setDiscountPrice] = useState(
    promotion.discountPrice?.toString() || "0"
  );
  const [discountTypeEnum, setDiscountTypeEnum] = useState(
    promotion.discountTypeEnum === "Percent" ? "Percent" : "Fixed"
  );
  const [maxDiscountValue, setMaxDiscountValue] = useState(
    promotion.maxDiscountValue?.toString() || ""
  );
  const [minOrderValue, setMinOrderValue] = useState(
    promotion.minOrderValue?.toString() || ""
  );
  const [discountUserNum, setDiscountUserNum] = useState(
    promotion.discountUserNum?.toString() || ""
  );
  const [discountTypeId, setDiscountTypeId] = useState(
    promotion.discountTypeId?.id ?? "none"
  );
  const [startTime, setStartTime] = useState(
    normalizeDateTime(promotion.startTime)
  );
  const [endTime, setEndTime] = useState(normalizeDateTime(promotion.endTime));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    promotion.image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  // Get query client for cache invalidation
  const queryClient = useQueryClient();

  // Fetch discount types
  const { data: discountTypesResponse, isLoading: isLoadingDiscountTypes } =
    useQuery({
      queryKey: ["discountTypes"],
      queryFn: () => PromotionService.getDiscountTypes(1, 100),
      select: (data) => data.data.items,
    });

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async () => {
    if (!title || !code || !discountPrice || !discountTypeEnum) {
      toast.error(
        "Please fill all required fields (Title, Code, Discount Price, Discount Type)"
      );
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
    if (discountTypeId !== "none") {
      formData.append("DiscountTypeId", discountTypeId);
    }
    formData.append("MaxDiscountValue", maxDiscountValue || "");
    formData.append("MinOrderValue", minOrderValue || "");
    formData.append("DiscountUserNum", discountUserNum || "");

    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (promotion.image) {
      formData.append("imageUrl", promotion.image);
    }

    try {
      setIsSubmitting(true);
      console.log("FormData sent to server:", {
        id: promotion.id,
        formData: Object.fromEntries(formData.entries()),
      });
      const res = await PromotionService.updatePromotion(
        promotion.id,
        formData
      );
      console.log("Server response:", res);
      toast.success(res.message || "Promotion updated successfully");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      onSuccess?.();
      onCancel();
    } catch (err: any) {
      console.error("Error response:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update promotion";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImageUrl = imagePreview || promotion.image;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit Promotion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div>
            <Label>Max Discount Value (Optional)</Label>
            <Input
              type="number"
              value={maxDiscountValue}
              onChange={(e) => setMaxDiscountValue(e.target.value)}
            />
          </div>
          <div>
            <Label>Min Order Value (Optional)</Label>
            <Input
              type="number"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)} // Fixed typo
            />
          </div>
          <div>
            <Label>Discount User Number (Optional)</Label>
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
                {discountTypesResponse?.length ? (
                  discountTypesResponse.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No discount types available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image (Optional)</Label>
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
            {showImageUrl && (
              <img
                src={showImageUrl}
                alt="Promotion preview"
                className="w-32 mt-2 rounded border cursor-pointer"
                onClick={() => setPreviewModal(true)}
                title="Click to view larger"
              />
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewModal && showImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewModal(false)}
        >
          <div
            className="relative max-w-3xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-10"
              onClick={() => setPreviewModal(false)}
            >
              <span className="text-xl font-bold text-gray-700">×</span>
            </button>
            <img
              src={showImageUrl}
              alt="Promotion preview"
              className="rounded-xl object-contain max-h-[80vh] w-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
