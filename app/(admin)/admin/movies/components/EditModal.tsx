"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useTranslation } from "react-i18next";

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

export const EditMovieModal = ({
  movieId,
  open,
  onOpenChange,
}: EditMovieModalProps) => {
  const { t } = useTranslation();
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
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) refetchMovie();
  }, [open, refetchMovie]);

  useEffect(() => {
    if (movie) {
      reset({
        Name: movie.name,
        Director: movie.director,
        Actor: movie.actor,
        Duration: movie.duration,
        ReleaseDate: movie.releaseDate.split(" ")[0],
        StartShow: movie.startShow.split(" ")[0],
        Age: movie.age,
        Description: movie.description,
        TrailerUrl: movie.trailerUrl,
      });
      setSelectedTypes(movie.movieTypes?.map((type: any) => type.name) ?? []);
    }
  }, [movie, reset]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    selectedTypes.forEach((type) => formData.append("MovieTypeNames", type));
    updateMovie(
      { id: movieId, data: formData },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-4">
              {t("movieedit.title")}
            </DialogTitle>
            <DialogDescription>{t("movieedit.description")}</DialogDescription>
          </DialogHeader>

          {isMovieLoading ? (
            <p>{t("movieedit.loadingMovie")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t("movieedit.name"), name: "Name" },
                { label: t("movieedit.director"), name: "Director" },
                { label: t("movieedit.actor"), name: "Actor" },
                {
                  label: t("movieedit.duration"),
                  name: "Duration",
                  type: "number",
                },
                {
                  label: t("movieedit.releaseDate"),
                  name: "ReleaseDate",
                  type: "date",
                },
                {
                  label: t("movieedit.startShow"),
                  name: "StartShow",
                  type: "date",
                },
              ].map(({ label, name, ...rest }) => (
                <div key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    {...register(name as keyof FormValues)}
                    {...rest}
                  />
                  {errors[name as keyof FormValues] && (
                    <p className="text-red-500 text-sm">
                      {errors[name as keyof FormValues]?.message as string}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <Label htmlFor="Age">{t("movieedit.age")}</Label>
                <Controller
                  name="Age"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="">{t("movieedit.selectAge")}</option>
                      {["P", "K", "T13", "T16", "T18"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.Age && (
                  <p className="text-red-500 text-sm">{errors.Age.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="Description">
                  {t("movieedit.descriptionField")}
                </Label>
                <Textarea {...register("Description")} rows={4} />
                {errors.Description && (
                  <p className="text-red-500 text-sm">
                    {errors.Description.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="TrailerUrl">{t("movieedit.trailer")}</Label>
                <Input {...register("TrailerUrl")} />
                {errors.TrailerUrl && (
                  <p className="text-red-500 text-sm">
                    {errors.TrailerUrl.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Label>{t("movieedit.types")}</Label>
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  {isTypesLoading ? (
                    <p>{t("movieedit.loadingTypes")}</p>
                  ) : (
                    types?.data?.map((type: any) => (
                      <div
                        key={type.id}
                        className="flex items-center gap-2 py-1"
                      >
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("movieedit.cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating || isMovieLoading}>
              {isUpdating ? t("movieedit.saving") : t("movieedit.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
