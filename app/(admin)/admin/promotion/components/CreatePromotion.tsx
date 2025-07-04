"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PromotionService } from "@/lib/api/service/fetchPromotion";
import { useCreatePromotion } from "@/hooks/usePromotions";

// Helper formatters
const formatVND = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const formatForServer = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? ""
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
};

export function PromotionCreateDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    code: "",
    discountPrice: "",
    discountTypeEnum: "Percent",
    discountTypeId: "none",
    maxDiscountValue: "",
    minOrderValue: "",
    discountUserNum: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [error, setError] = useState("");

  const { createPromotion, isCreating } = useCreatePromotion();
  const { data: discountTypes = [], isLoading: isLoadingDiscountTypes } =
    useQuery({
      queryKey: ["discountTypes"],
      queryFn: () => PromotionService.getDiscountTypes(1, 100),
      select: (data) => data.data.items,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateForm = () => {
    const { title, startDate, endDate, code, discountPrice, discountTypeEnum } =
      formData;

    if (
      !title ||
      !startDate ||
      !endDate ||
      !code ||
      !discountPrice ||
      !discountTypeEnum ||
      !imageFile
    ) {
      setError("All required fields must be filled.");
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start Date must be before End Date.");
      return false;
    }

    if (isNaN(+discountPrice) || +discountPrice <= 0) {
      setError("Discount Price must be a positive number.");
      return false;
    }

    const optionalFields = [
      "maxDiscountValue",
      "minOrderValue",
      "discountUserNum",
    ];
    for (const field of optionalFields) {
      const value = formData[field as keyof typeof formData];
      if (value && isNaN(Number(value))) {
        setError(`${field} must be a number`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("Title", formData.title);
    data.append("StartTime", formatForServer(formData.startDate));
    data.append("EndTime", formatForServer(formData.endDate));
    data.append("Code", formData.code);
    data.append("DiscountPrice", formData.discountPrice);
    data.append("DiscountTypeEnum", formData.discountTypeEnum);
    if (formData.discountTypeId !== "none") {
      data.append("DiscountTypeId", formData.discountTypeId);
    }
    data.append("MaxDiscountValue", formData.maxDiscountValue || "0");
    data.append("MinOrderValue", formData.minOrderValue || "0");
    data.append("DiscountUserNum", formData.discountUserNum || "0");
    if (imageFile) {
      data.append("imageFile", imageFile);
    }

    createPromotion(data, {
      onSuccess: () => {
        toast.success("Promotion created!");
        setFormData({
          title: "",
          startDate: "",
          endDate: "",
          code: "",
          discountPrice: "",
          discountTypeEnum: "Percent",
          discountTypeId: "none",
          maxDiscountValue: "",
          minOrderValue: "",
          discountUserNum: "",
        });
        setImageFile(null);
        setImagePreview(null);
        setOpen(false);
      },
      onError: (err) => {
        const msg = err?.message || "Create failed.";
        toast.error(msg);
        setError(msg);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Promotion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Promotion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Discount Price *</Label>
            <input
              name="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountTypeEnum">Type *</Label>
            <select
              name="discountTypeEnum"
              value={formData.discountTypeEnum}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            >
              <option value="Percent">Percent</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountTypeId">Discount Type</Label>
            <select
              name="discountTypeId"
              value={formData.discountTypeId}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
              disabled={isLoadingDiscountTypes}
            >
              <option value="none">None</option>
              {discountTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Image *</Label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 border rounded-md w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 mt-2 rounded border"
                onClick={() => setPreviewModal(true)}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDiscountValue">Max Value</Label>
            <input
              name="maxDiscountValue"
              type="number"
              value={formData.maxDiscountValue}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minOrderValue">Min Order</Label>
            <input
              name="minOrderValue"
              type="number"
              value={formData.minOrderValue}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountUserNum">User Limit</Label>
            <input
              name="discountUserNum"
              type="number"
              value={formData.discountUserNum}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
          <div className="flex space-x-4 pt-2">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>

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
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-10"
                onClick={() => setPreviewModal(false)}
              >
                <span className="text-xl font-bold text-gray-700">×</span>
              </button>
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-xl object-contain max-h-[80vh] w-auto"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
