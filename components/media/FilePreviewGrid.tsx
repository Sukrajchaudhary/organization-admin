import { Button } from "@/components/ui/button";
import { FilePreviewItem } from "./FilePreviewItem";

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  error?: string;
}

interface FilePreviewGridProps {
  files: FileWithPreview[];
  validFilesCount: number;
  invalidFilesCount: number;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export const FilePreviewGrid = ({
  files,
  validFilesCount,
  invalidFilesCount,
  onRemove,
  onClearAll,
  disabled = false,
}: FilePreviewGridProps) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Selected Files: {validFilesCount} valid
          {invalidFilesCount > 0 && (
            <span className="text-red-500 ml-2">
              ({invalidFilesCount} invalid)
            </span>
          )}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          disabled={disabled}
          type="button"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map((file) => (
          <FilePreviewItem
            key={file.id}
            file={file}
            onRemove={onRemove}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};