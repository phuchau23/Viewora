"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateSnack } from "@/hooks/useSnacks";
import { formatVND } from "@/utils/price/formatPrice";

export default function AddSnackDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [error, setError] = useState("");
  const { createSnack, isCreating } = useCreateSnack();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("Name", formData.name);
    data.append("Price", formData.price);
    if (imageFile) {
      data.append("file", imageFile);
      data.append("imageFile", imageFile);
    }

    createSnack(data, {
      onSuccess: () => {
        toast.success("Snack created!");
        setFormData({
          name: "",
          price: "",
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
          Add Snack
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Snack</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Snack Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (VND) *</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            {formData.price && (
              <p className="text-sm text-gray-500 mt-1">
                Preview: {formatVND(Number(formData.price))}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Image *</Label>
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
              />
            )}
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
