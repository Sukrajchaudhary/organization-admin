import { useState, useCallback, useEffect } from "react";
import { validateImageFile } from "@/lib/fileValidation";

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  error?: string;
}

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  const createFileWithPreview = useCallback((file: File): FileWithPreview => {
    const error = validateImageFile(file);

    return {
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      error: error || undefined,
    };
  }, []);

  const handleFiles = useCallback(
    (selectedFiles: File[]) => {
      if (selectedFiles.length === 0) return;

      const filesWithPreview = selectedFiles.map(createFileWithPreview);

      // Show alert if some files have errors
      const errorCount = filesWithPreview.filter((f) => f.error).length;
      if (errorCount > 0) {
        console.warn(
          `${errorCount} file(s) have errors and cannot be uploaded`
        );
      }

      setFiles((prev) => [...prev, ...filesWithPreview]);
    },
    [createFileWithPreview]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const validFiles = files.filter((f) => !f.error);
  const hasErrors = files.some((f) => f.error);

  return {
    files,
    handleFiles,
    removeFile,
    clearAll,
    validFiles,
    hasErrors,
  };
};