"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSnacks } from "@/hooks/useSnacks";

interface AddSnackFormProps {
  onCancel: () => void;
}

export default function AddSnackForm({ onCancel }: AddSnackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [error, setError] = useState("");
  const isAdmin = true; // Replace with actual auth check
  const { create } = useSnacks();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.name || !formData.price || !imageFile) {
      setError("All fields are required.");
      return false;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError("Price must be a valid positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      data.append("Name", formData.name);
      data.append("Price", formData.price);
      if (imageFile) {
        data.append("imageFile", imageFile);
      }

      create(data, {
        onSuccess: () => {
          toast.success("Snack added successfully!", {
            duration: 4000,
            position: "top-right",
          });
          setFormData({
            name: "",
            price: "",
          });
          setImageFile(null);
          setImagePreview(null);
          setTimeout(() => {
            onCancel();
          }, 100);
        },
        onError: (error) => {
          setError(error.message || "Failed to add snack");
          toast.error(error.message || "Failed to add snack", {
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
        Add New Snack
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Snack Name"
          />
        </div>
        <div>
          <Label>Price (VND)</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />
        </div>
        <div>
          <Label>Image</Label>
          <Input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 mt-2 rounded border cursor-pointer"
              onClick={() => setPreviewModal(true)}
              title="Click to view larger"
            />
          )}
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Add Snack</Button>
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
