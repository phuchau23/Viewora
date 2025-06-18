"use client";
import { FormEvent, useState, useEffect } from "react";
import { useCreateMovie } from "@/hooks/useMovie";
import { useGetTypes } from "@/hooks/useTypes";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const CreateModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);

  const { mutate: createMovie, isPending: isCreating } = useCreateMovie(); // Thêm isPending
  const { types, isLoading: isTypesLoading } = useGetTypes(); // Đổi tên cho rõ ràng

  const handleSelectType = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setBannerFiles((prev) => [...prev, ...files]);
    setBannerPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removePoster = () => {
    if (posterPreview) URL.revokeObjectURL(posterPreview);
    setPosterFile(null);
    setPosterPreview(null);
  };

  const removeBannerAt = (index: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    selectedTypes.forEach((type) => formData.append("MovieTypeNames", type));
    if (posterFile) formData.append("Poster", posterFile);
    bannerFiles.forEach((file) => formData.append("Banner", file));

    createMovie(formData, {
      onSuccess: () => setOpen(false),
      onError: (error) => console.error("Lỗi khi tạo phim:", error),
    });
  };

  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      bannerPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [posterPreview, bannerPreviews]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm phim mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-4">
              Thêm phim mới
            </DialogTitle>
            <DialogDescription>Thêm thông tin phim.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Name">Tên phim</Label>
              <Input name="Name" required />
            </div>
            <div>
              <Label htmlFor="Director">Đạo diễn</Label>
              <Input name="Director" required />
            </div>
            <div>
              <Label htmlFor="Actor">Diễn viên</Label>
              <Input name="Actor" required />
            </div>
            <div>
              <Label htmlFor="Duration">Thời lượng (phút)</Label>
              <Input name="Duration" type="number" required />
            </div>
            <div>
              <Label htmlFor="Rate">Đánh giá</Label>
              <Input name="Rate" type="number" step="0.1" required />
            </div>
            <div>
              <Label htmlFor="ReleaseDate">Ngày phát hành</Label>
              <Input name="ReleaseDate" type="date" required />
            </div>
            <div>
              <Label htmlFor="StartShow">Ngày chiếu</Label>
              <Input name="StartShow" type="date" required />
            </div>
            <div>
              <Label htmlFor="Age">Độ tuổi</Label>
              <select
                name="Age"
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">Chọn độ tuổi</option>
                <option value="P">P</option>
                <option value="K">K</option>
                <option value=" eerlijkT13">T13</option>
                <option value="T16">T16</option>
                <option value="T18">T18</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="Description">Mô tả</Label>
              <Textarea name="Description" rows={4} required />
            </div>
            <div className="col-span-2">
              <Label htmlFor="TrailerUrl">URL trailer</Label>
              <Input name="TrailerUrl" required />
            </div>

            <div className="col-span-2">
              <Label>Thể loại (chọn nhiều)</Label>
              <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                {isTypesLoading ? (
                  <p>Đang tải...</p>
                ) : (
                  types?.data?.map((type) => (
                    <div key={type.id} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.name)}
                        onChange={() => handleSelectType(type.name)}
                      />
                      <span>{type.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="Poster">Poster</Label>
              <Input
                name="Poster"
                type="file"
                accept="image/*"
                required={!posterFile}
                onChange={handlePosterChange}
              />
              {posterPreview && (
                <div className="mt-2 relative w-fit">
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePoster}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                  >
                    X
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="Banner">Banner (nhiều ảnh)</Label>
              <Input
                name="Banner"
                type="file"
                multiple
                accept="image/*"
                onChange={handleBannerChange}
              />
              {bannerPreviews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {bannerPreviews.map((url, index) => (
                    <div key={index} className="relative w-fit">
                      <img
                        src={url}
                        alt={`Banner Preview ${index + 1}`}
                        className="w-32 h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeBannerAt(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Đang lưu..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};