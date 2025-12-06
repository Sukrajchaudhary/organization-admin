"use client";
import { useState, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { uploadMedia } from "@/apiServices/media/api.mediaServices";
import { useFileUpload } from "@/hooks/useFileUpload";
import { DragDropZone } from "./DragDropZone";
import { FilePreviewGrid } from "./FilePreviewGrid";
import { UploadProgress } from "./UploadProgress";
import { UploadActions } from "./UploadActions";
import { StatusMessages } from "./StatusMessages";

export const ImageUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { files, handleFiles, removeFile, clearAll, validFiles, hasErrors } = useFileUpload();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      try {
        const result = await uploadMedia(formData);
        setUploadProgress(100);
        clearInterval(progressInterval);
        return result;
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully uploaded ${validFiles.length} image(s)!`,
      });
      queryClient.invalidateQueries({ queryKey: ["media"] });
      clearAll();
      setTimeout(() => setUploadProgress(0), 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Upload failed. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleUpload = async () => {
    if (validFiles.length === 0) {
      alert("No valid files to upload");
      return;
    }
    const formData = new FormData();
    validFiles.forEach((item) => {
      formData.append("media", item.file);
    });
    uploadMutation.mutate(formData);
  };
  const onZoneClick = () => fileInputRef.current?.click();
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DragDropZone
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={onZoneClick}
            disabled={uploadMutation.isPending}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <FilePreviewGrid
            files={files}
            validFilesCount={validFiles.length}
            invalidFilesCount={files.length - validFiles.length}
            onRemove={removeFile}
            onClearAll={clearAll}
            disabled={uploadMutation.isPending}
          />

          <UploadProgress
            uploadProgress={uploadProgress}
            isPending={uploadMutation.isPending}
            validFilesCount={validFiles.length}
          />

          <UploadActions
            validFilesCount={validFiles.length}
            onUpload={handleUpload}
            isPending={uploadMutation.isPending}
          />

          <StatusMessages
            hasErrors={hasErrors}
            invalidFilesCount={files.length - validFiles.length}
          />
        </CardContent>
      </Card>
    </div>
  );
};
