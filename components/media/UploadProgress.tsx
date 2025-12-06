import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  uploadProgress: number;
  isPending: boolean;
  validFilesCount: number;
}

export const UploadProgress = ({ uploadProgress, isPending, validFilesCount }: UploadProgressProps) => {
  if (!isPending) return null;

  return (
    <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Uploading {validFilesCount} file(s)...</span>
        <span>{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="w-full h-2" />
    </div>
  );
};