import { useState, useEffect, useCallback } from "react";

type PreviewItem = {
  url: string;
  isServer: boolean;
};

export function useImageUpload(multiple = false) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [removedServerUrls, setRemovedServerUrls] = useState<string[]>([]);

  // Khởi tạo preview từ URL ảnh đã lưu trong DB
  const setInitialUrls = useCallback((urls: string[]) => {
    const formatted = urls.map((url) => ({ url, isServer: true }));
    setPreviews((prev) => [...prev, ...formatted]);
  }, []);

  // Upload mới
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = Array.from(e.target.files ?? []);
    if (inputFiles.length === 0) return;

    const newPreviews = inputFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isServer: false,
    }));

    setFiles((prev) => (multiple ? [...prev, ...inputFiles] : inputFiles));
    setPreviews((prev) =>
      multiple ? [...prev, ...newPreviews] : newPreviews
    );
  };

  // Xoá ảnh theo index
  const removeAt = (index: number) => {
    setPreviews((prev) => {
      const removed = prev[index];
      if (!removed) return prev;

      if (!removed.isServer) {
        // Xoá file mới
        setFiles((f) => f.filter((_, i) => i !== index));
        URL.revokeObjectURL(removed.url);
      } else {
        // Lưu lại server url bị xoá
        setRemovedServerUrls((prev) => [...prev, removed.url]);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const reset = () => {
    previews.forEach((p) => {
      if (!p.isServer) URL.revokeObjectURL(p.url);
    });
    setFiles([]);
    setPreviews([]);
    setRemovedServerUrls([]);
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return {
    files, // File[] để append FormData
    previews, // [{ url, isServer }]
    removedServerUrls, // ảnh từ DB bị xoá
    handleChange,
    removeAt,
    setInitialUrls,
    reset,
  };
}
