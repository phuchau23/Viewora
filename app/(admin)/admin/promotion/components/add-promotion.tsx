"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePromotions } from "@/hooks/usePromotions";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { PromotionService } from "@/lib/api/service/fetchPromotion";

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

interface AddPromotionFormProps {
  onCancel: () => void;
}

export default function AddPromotionForm({ onCancel }: AddPromotionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    code: "",
    discountPrice: "",
    discountTypeEnum: "Percent",
    discountTypeId: "none", // Use "none" for no selection
    maxDiscountValue: "",
    minOrderValue: "",
    discountUserNum: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [error, setError] = useState("");
  const isAdmin = true; // Replace with actual auth check
  const { create } = usePromotions();

  // Fetch discount types
  const { data: discountTypesResponse, isLoading: isLoadingDiscountTypes } =
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
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.code ||
      !formData.discountPrice ||
      !formData.discountTypeEnum ||
      !imageFile
    ) {
      setError("All fields are required except optional ones.");
      return false;
    }
    if (new Date(formData.startTime) > new Date(formData.endTime)) {
      setError("Start Time must not be later than End Time.");
      return false;
    }
    if (
      isNaN(Number(formData.discountPrice)) ||
      Number(formData.discountPrice) <= 0
    ) {
      setError("Discount Price must be a valid positive number.");
      return false;
    }
    if (formData.maxDiscountValue && isNaN(Number(formData.maxDiscountValue))) {
      setError("Max Discount Value must be a valid number.");
      return false;
    }
    if (formData.minOrderValue && isNaN(Number(formData.minOrderValue))) {
      setError("Minimum Order Value must be a valid number.");
      return false;
    }
    if (formData.discountUserNum && isNaN(Number(formData.discountUserNum))) {
      setError("Discount User Limit must be a valid number.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      data.append("Title", formData.title);
      data.append("StartTime", formatForServer(formData.startTime));
      data.append("EndTime", formatForServer(formData.endTime));
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

      create(data, {
        onSuccess: () => {
          toast.success("Promotion added successfully!", {
            duration: 4000,
            position: "top-right",
          });
          setFormData({
            title: "",
            startTime: "",
            endTime: "",
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
          setTimeout(() => {
            onCancel();
          }, 100);
        },
        onError: (error) => {
          setError(error.message || "Failed to add promotion");
          toast.error(error.message || "Failed to add promotion", {
            duration: 4000,
            position: "top-right",
          });
        },
      });
    }
  };

  if (!isAdmin) {
    return (
      <p className="text-red-500 dark:text-red-400 text-center">
        Access denied. Admin role required.
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Add New Promotion
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Promotion Title"
          className="p-2 border rounded-md"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="p-2 border rounded-md"
        />
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="p-2 border rounded-md"
        />
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Promotion Code (e.g., Xinchao)"
          className="p-2 border rounded-md"
        />
        <input
          type="number"
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
          placeholder="Discount Price"
          className="p-2 border rounded-md"
        />
        <select
          name="discountTypeEnum"
          value={formData.discountTypeEnum}
          onChange={handleChange}
          className="p-2 border rounded-md"
        >
          <option value="Percent">Percentage</option>
          <option value="Fixed">Fixed Amount</option>
        </select>
        <select
          name="discountTypeId"
          value={formData.discountTypeId}
          onChange={handleChange}
          disabled={isLoadingDiscountTypes}
          className="p-2 border rounded-md"
        >
          <option value="none">None</option>
          {discountTypesResponse?.length ? (
            discountTypesResponse.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))
          ) : (
            <option value="none" disabled>
              No discount types available
            </option>
          )}
        </select>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded-md"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 mt-2 rounded border cursor-pointer"
            onClick={() => setPreviewModal(true)}
            title="Bấm để xem lớn"
          />
        )}
        <input
          type="number"
          name="maxDiscountValue"
          value={formData.maxDiscountValue}
          onChange={handleChange}
          placeholder="Max Discount Value (0 for none)"
          className="p-2 border rounded-md"
        />
        <input
          type="number"
          name="minOrderValue"
          value={formData.minOrderValue}
          onChange={handleChange}
          placeholder="Minimum Order Value (0 for none)"
          className="p-2 border rounded-md"
        />
        <input
          type="number"
          name="discountUserNum"
          value={formData.discountUserNum}
          onChange={handleChange}
          placeholder="Discount User Limit (0 for unlimited)"
          className="p-2 border rounded-md"
        />
        <div className="flex space-x-4">
          <Button type="submit">Add Promotion</Button>
          <Button variant="outline" onClick={onCancel}>
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
    </div>
  );
}
