'use client';
import { FormEvent, useState } from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const CreateModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { mutate: createMovie } = useCreateMovie();
  const { types, isLoading } = useGetTypes();

  const handleSelectType = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Thêm các thể loại được chọn vào FormData
    selectedTypes.forEach((type) => {
      formData.append("MovieTypeNames", type);
    });

    // Gọi API tạo phim
    createMovie(formData, {
      onSuccess: () => {
        setOpen(false); // Đóng modal khi thành công
      },
      onError: (error) => {
        console.error("Lỗi khi tạo phim:", error);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm phim mới</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-4">
              Thêm phim mới
            </DialogTitle>
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
                <option value="T13">T13</option>
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

            {/* Multi select movie types */}
            <div className="col-span-2">
              <Label>Thể loại (chọn nhiều)</Label>
              <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                {isLoading ? (
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
              <Input name="Poster" type="file" required />
            </div>

            {/* Multiple Banner Upload */}
            <div className="col-span-2">
              <Label htmlFor="Banner">Banner (nhiều)</Label>
              <Input
                name="Banner"
                type="file"
                multiple
                required
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  console.log(
                    "Chọn banner:",
                    files.map((f) => f.name).join(", ")
                  );
                }}
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
