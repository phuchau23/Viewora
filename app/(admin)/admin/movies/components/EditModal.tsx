'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

interface EditMovieModalProps {
  movieId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z.object({
  Name: z.string().min(1),
  Director: z.string().min(1),
  Actor: z.string().min(1),
  Duration: z.coerce.number().min(1),
  Rate: z.coerce.number().min(0).max(10),
  ReleaseDate: z.string().min(1),
  StartShow: z.string().min(1),
  Age: z.string().min(1),
  Description: z.string().min(1),
  TrailerUrl: z.string().url(),
});

type FormValues = z.infer<typeof schema>;

export const EditMovieModal = ({ movieId, open, onOpenChange }: EditMovieModalProps) => {
  const {
    movie,
    isLoading: isMovieLoading,
    refetch: refetchMovie,
  } = useGetMovieById(movieId);
  const { updateMovie, isPending: isUpdating } = useUpdateMovie();
  const { types, isLoading: isTypesLoading } = useGetTypes();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      refetchMovie();
    }
  }, [open, refetchMovie]);

  useEffect(() => {
    if (movie) {
      const data = movie;
      reset({
        Name: data.name,
        Director: data.director,
        Actor: data.actor,
        Duration: data.duration,
        Rate: data.rate,
        ReleaseDate: data.releaseDate.split("T")[0],
        StartShow: data.startShow.split("T")[0],
        Age: data.age,
        Description: data.description,
        TrailerUrl: data.trailerUrl,
      });
      setSelectedTypes(data.movieTypes.map((type: any) => type.name));
    }
  }, [movie, reset]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });
    // selectedTypes.forEach((type) => formData.append("MovieTypeNames", type));
    updateMovie(
      { id: movieId, data: formData },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {[
                { label: "Tên phim", name: "Name" },
                { label: "Đạo diễn", name: "Director" },
                { label: "Diễn viên", name: "Actor" },
                { label: "Thời lượng (phút)", name: "Duration", type: "number" },
                { label: "Đánh giá", name: "Rate", type: "number", step: 0.1 },
                { label: "Ngày phát hành", name: "ReleaseDate", type: "date" },
                { label: "Ngày chiếu", name: "StartShow", type: "date" },
              ].map(({ label, name, ...rest }) => (
                <div key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} {...register(name as keyof FormValues)} {...rest} />
                  {errors[name as keyof FormValues] && (
                    <p className="text-red-500 text-sm">{errors[name as keyof FormValues]?.message as string}</p>
                  )}
                </div>
              ))}

              <div>
                <Label htmlFor="Age">Độ tuổi</Label>
                <select {...register("Age")} className="w-full p-2 border rounded-md">
                  <option value="">Chọn độ tuổi</option>
                  {["P", "K", "T13", "T16", "T18"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.Age && <p className="text-red-500 text-sm">{errors.Age.message}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="Description">Mô tả</Label>
                <Textarea {...register("Description")} rows={4} />
                {errors.Description && <p className="text-red-500 text-sm">{errors.Description.message}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="TrailerUrl">URL trailer</Label>
                <Input {...register("TrailerUrl")} />
                {errors.TrailerUrl && <p className="text-red-500 text-sm">{errors.TrailerUrl.message}</p>}
              </div>

              <div className="col-span-2">
                <Label>Thể loại</Label>
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  {isTypesLoading ? (
                    <p>Đang tải...</p>
                  ) : (
                    types?.data?.map((type: any) => (
                      <div key={type.id} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type.name)}
                          onChange={() => toggleType(type.name)}
                        />
                        <span>{type.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isUpdating || isMovieLoading}>
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
