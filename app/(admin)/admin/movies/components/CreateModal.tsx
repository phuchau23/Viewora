"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateMovie } from "@/hooks/useMovie";
import { useGetTypes } from "@/hooks/useTypes";
import { useTranslation } from "react-i18next";

export const CreateModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);

  const { createMovie, isPending: isCreating } = useCreateMovie();
  const { types, isLoading: isTypesLoading } = useGetTypes();

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
    const form = e.currentTarget;
    const formData = new FormData();

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

    formData.append("Name", get("Name"));
    formData.append("Description", get("Description"));
    formData.append("Director", get("Director"));
    formData.append("Actor", get("Actor"));
    formData.append("Duration", get("Duration"));
    formData.append("Rate", get("Rate"));
    formData.append("ReleaseDate", get("ReleaseDate"));
    formData.append("StartShow", get("StartShow"));
    formData.append("Trailer", get("Trailer"));
    formData.append("Age", get("Age"));

    if (selectedTypes.length === 0) {
      alert(t("movieadd.selectTypeWarning"));
      return;
    }

    selectedTypes.forEach((type) => formData.append("MovieTypeNames", type));

    if (posterFile) formData.append("Poster", posterFile);
    bannerFiles.forEach((file) => formData.append("Banner", file));

    createMovie(formData, {
      onSuccess: () => setOpen(false),
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
        <Button>{t("movieadd.addButton")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] rounded-2xl shadow-xl p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              {t("movieadd.title")}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              {t("movieadd.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Name", "Director", "Actor", "Duration", "Rate"].map(
              (field, i) => (
                <div key={i} className="space-y-1">
                  <Label htmlFor={field}>
                    {t(`movieadd.${field.toLowerCase()}`)}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    type={
                      ["Duration", "Rate"].includes(field) ? "number" : "text"
                    }
                    required
                  />
                </div>
              )
            )}

            <div className="space-y-1">
              <Label htmlFor="ReleaseDate">{t("movieadd.releaseDate")}</Label>
              <Input type="date" name="ReleaseDate" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="StartShow">{t("movieadd.startShow")}</Label>
              <Input type="date" name="StartShow" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="Age">{t("movieadd.age")}</Label>
              <select
                name="Age"
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">{t("movieadd.selectAge")}</option>
                {["P", "K", "T13", "T16", "T18"].map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="Description">
                {t("movieadd.descriptionField")}
              </Label>
              <Textarea name="Description" rows={4} required />
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="Trailer">{t("movieadd.trailer")}</Label>
              <Input name="Trailer" required />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>{t("movieadd.types")}</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto">
                {isTypesLoading ? (
                  <p>{t("movieadd.loadingTypes")}</p>
                ) : (
                  types?.data?.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`type-${type.name}`}
                        checked={selectedTypes.includes(type.name)}
                        onCheckedChange={() => handleSelectType(type.name)}
                      />
                      <Label htmlFor={`type-${type.name}`}>{type.name}</Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => document.getElementById("bannerInput")?.click()}
                className="px-4 py-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition"
              >
                {t("movieadd.uploadBanners")}
              </button>
              <input
                id="bannerInput"
                type="file"
                name="Banner"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleBannerChange}
              />
              {bannerPreviews.length > 0 && (
                <div className="mt-3 border-2 border-dashed border-orange-400 p-3 rounded-md grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bannerPreviews.map((url, index) => (
                    <div key={index} className="relative w-fit">
                      <img
                        src={url}
                        className="w-28 h-28 object-cover rounded shadow border"
                        alt={`Banner ${index}`}
                      />
                      <button
                        onClick={() => removeBannerAt(index)}
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => document.getElementById("posterInput")?.click()}
                className="px-4 py-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition"
              >
                {t("movieadd.uploadPoster")}
              </button>
              <input
                id="posterInput"
                type="file"
                name="Poster"
                accept="image/*"
                className="hidden"
                required={!posterFile}
                onChange={handlePosterChange}
              />
              {posterPreview && (
                <div className="mt-3 border-2 border-dashed border-orange-400 p-3 rounded-md w-fit relative">
                  <img
                    src={posterPreview}
                    className="w-32 h-32 object-cover rounded shadow border"
                    alt="Poster"
                  />
                  <button
                    onClick={removePoster}
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">{t("movieadd.cancel")}</Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? t("movieadd.saving") : t("movieadd.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
