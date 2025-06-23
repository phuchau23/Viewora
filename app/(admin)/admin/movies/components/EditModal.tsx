"use client";

import { FormEvent, useState, useEffect } from "react";
import { useUpdateMovie, useGetMovieById } from "@/hooks/useMovie";
import { useGetTypes } from "@/hooks/useTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/dates/formatDate";

interface EditMovieModalProps {
  movieId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditMovieModal = ({
  movieId,
  open,
  onOpenChange,
}: EditMovieModalProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [existingBanners, setExistingBanners] = useState<
    { id: string; url: string }[]
  >([]);
  const [bannersToRemove, setBannersToRemove] = useState<string[]>([]);
  const [newBannerFiles, setNewBannerFiles] = useState<File[]>([]);
  const [newBannerPreviews, setNewBannerPreviews] = useState<string[]>([]);

  // Fetch dữ liệu
  const { data: movie, isLoading: isMovieLoading } = useGetMovieById(movieId);
  console.log(formatDate(movie?.data.releaseDate));
  const {
    mutate: updateMovie,
    isPending: isUpdating, // Thêm isPending để theo dõi trạng thái mutation
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    data: updateData,
  } = useUpdateMovie();
  const { types, isLoading: isTypesLoading } = useGetTypes();

  // Khởi tạo form khi modal mở hoặc movie thay đổi
  useEffect(() => {
    if (open && movie) {
      setSelectedTypes(movie.data.movieTypes.map((type: any) => type.name));
      setPosterPreview(movie.data.poster);
      setExistingBanners(
        Array.isArray(movie.data.banner)
          ? movie.data.banner.map((banner: any) => ({
              id: banner.id,
              url: banner.url,
            }))
          : []
      );
      setBannersToRemove([]);
      setNewBannerFiles([]);
      setNewBannerPreviews([]);
    }
  }, [open, movie]);

  // Xử lý chọn thể loại
  const handleSelectType = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
  };

  // Xử lý thay đổi poster
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (posterPreview && posterFile) URL.revokeObjectURL(posterPreview);
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  // Xử lý thay đổi banners mới
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewBannerFiles((prev) => [...prev, ...files]);
    setNewBannerPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // Xóa poster mới (quay lại poster cũ)
  const removePoster = () => {
    if (posterFile) {
      URL.revokeObjectURL(posterPreview!);
      setPosterFile(null);
      setPosterPreview(movie?.data.poster || null);
    }
  };

  // Xóa banner hiện có
  const removeExistingBanner = (id: string) => {
    setBannersToRemove((prev) => [...prev, id]);
  };

  // Xóa banner mới
  const removeNewBanner = (index: number) => {
    setNewBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setNewBannerPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Xử lý submit form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    selectedTypes.forEach((type) => formData.append("MovieTypeNames", type));
    if (posterFile) formData.append("Poster", posterFile);
    newBannerFiles.forEach((file) => formData.append("Banner", file));
    if (bannersToRemove.length > 0) {
      formData.append("removeBanners", JSON.stringify(bannersToRemove));
    }

    updateMovie(
      { id: movieId, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
          // Cleanup
          if (posterFile) URL.revokeObjectURL(posterPreview!);
          newBannerPreviews.forEach((url) => URL.revokeObjectURL(url));
        },
      }
    );
  };

  // Cleanup URLs khi modal đóng hoặc unmount
  useEffect(() => {
    return () => {
      if (posterPreview && posterFile) URL.revokeObjectURL(posterPreview);
      newBannerPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [posterPreview, newBannerPreviews, posterFile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-4">
              Chỉnh sửa phim
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết của phim.
            </DialogDescription>
          </DialogHeader>
          {isMovieLoading ? (
            <p>Đang tải thông tin phim...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="Name">Tên phim</Label>
                <Input name="Name" defaultValue={movie?.data.name} required />
              </div>
              <div>
                <Label htmlFor="Director">Đạo diễn</Label>
                <Input
                  name="Director"
                  defaultValue={movie?.data.director}
                  required
                />
              </div>
              <div>
                <Label htmlFor="Actor">Diễn viên</Label>
                <Input name="Actor" defaultValue={movie?.data.actor} required />
              </div>
              <div>
                <Label htmlFor="Duration">Thời lượng (phút)</Label>
                <Input
                  name="Duration"
                  type="number"
                  defaultValue={movie?.data.duration}
                  required
                />
              </div>
              <div>
                <Label htmlFor="Rate">Đánh giá</Label>
                <Input
                  name="Rate"
                  type="number"
                  step="0.1"
                  defaultValue={movie?.data.rate}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ReleaseDate">Ngày phát hành</Label>
                <Input
                  name="ReleaseDate"
                  type="date"
                  defaultValue={formatDate(movie?.data.releaseDate)}
                />
              </div>
              <div>
                <Label htmlFor="StartShow">Ngày chiếu</Label>
                <Input
                  name="StartShow"
                  type="date"
                  defaultValue={formatDate(movie?.data.startShow)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="Age">Độ tuổi</Label>
                <select
                  name="Age"
                  defaultValue={movie?.data.age}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Chọn độ tuổi</option>
                  <option value="P">P</option>
                  <option value="K">K</option>
                  <option value="T13">T13</option>
                  <option value="T16">T16</option>
                  <option value="T18">T18</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="Description">Mô tả</Label>
                <Textarea
                  name="Description"
                  defaultValue={movie?.data.description}
                  rows={4}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="TrailerUrl">URL trailer</Label>
                <Input
                  name="TrailerUrl"
                  defaultValue={movie?.data.trailerUrl}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Thể loại (chọn nhiều)</Label>
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  {isTypesLoading ? (
                    <p>Đang tải...</p>
                  ) : (
                    types?.data?.map((type: any) => (
                      <div
                        key={type.id}
                        className="flex items-center gap-2 py-1"
                      >
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
                  onChange={handlePosterChange}
                />
                {posterPreview && (
                  <div className="mt-2 relative w-fit">
                    <img
                      src={posterPreview}
                      alt="Poster Preview"
                      className="w-32 h-32 object-cover"
                    />
                    {posterFile && (
                      <button
                        type="button"
                        onClick={removePoster}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                      >
                        X
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <Label>Banners</Label>
                <div className="mt-2">
                  {existingBanners
                    .filter((banner) => !bannersToRemove.includes(banner.id))
                    .map((banner) => (
                      <div
                        key={banner.id}
                        className="relative w-fit inline-block mr-2 mb-2"
                      >
                        <img
                          src={banner.url}
                          alt="Existing Banner"
                          className="w-32 h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingBanner(banner.id)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  {newBannerPreviews.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-fit inline-block mr-2 mb-2"
                    >
                      <img
                        src={url}
                        alt={`New Banner Preview ${index + 1}`}
                        className="w-32 h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewBanner(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  name="Banner"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isUpdating || isMovieLoading}>
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
