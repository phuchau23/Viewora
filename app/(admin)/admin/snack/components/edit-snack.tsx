// components/edit-snack.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Snack } from "@/lib/api/service/fetchSnack";
import { useSnacks } from "@/hooks/useSnacks";

interface EditSnackFormProps {
  snack: Snack;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function EditSnackForm({
  snack,
  onCancel,
  onSuccess,
}: EditSnackFormProps) {
  const [name, setName] = useState(snack.name || "");
  const [price, setPrice] = useState(snack.price.toString());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const { update, isUpdating } = useSnacks();

  const handleSubmit = async () => {
    if (!name || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name); // Use capitalized "Name" to match Swagger
    formData.append("Price", price); // Use capitalized "Price" to match Swagger
    if (imageFile) {
      formData.append("file", imageFile); // Use "file" as per Swagger
      formData.append("imageFile", imageFile); // Include "imageFile" as per Swagger
    } else {
      formData.append("imageUrl", snack.image); // Send existing image URL if no new file
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting update for snack:", {
        id: snack.id,
        Name: name,
        Price: price,
        imageFile,
      });
      await update({ id: snack.id, formData });
      toast.success("Snack updated successfully");
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update snack";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImageUrl = imagePreview || snack.image;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit Snack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
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
            {showImageUrl && (
              <img
                src={showImageUrl}
                alt="Snack preview"
                className="w-32 mt-2 rounded border cursor-pointer"
                onClick={() => setPreviewModal(true)}
                title="Click to view larger"
              />
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              disabled={isSubmitting || isUpdating}
              onClick={handleSubmit}
            >
              {isSubmitting || isUpdating ? "Saving..." : "Save"}
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
              alt="Snack preview"
              className="rounded-xl object-contain max-h-[80vh] w-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
