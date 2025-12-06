import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadActionsProps {
  validFilesCount: number;
  onUpload: () => void;
  isPending: boolean;
}

export const UploadActions = ({ validFilesCount, onUpload, isPending }: UploadActionsProps) => {
  if (validFilesCount === 0) return null;

  return (
    <div className="flex gap-3 pt-2">
      <Button
        onClick={onUpload}
        disabled={isPending || validFilesCount === 0}
        className="flex-1"
        size="lg"
        type="button"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isPending
          ? `Uploading ${validFilesCount} file(s)...`
          : `Upload ${validFilesCount} Image${validFilesCount > 1 ? "s" : ""}`}
      </Button>
    </div>
  );
};