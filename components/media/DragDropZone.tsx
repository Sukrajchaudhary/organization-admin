import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface DragDropZoneProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  disabled?: boolean;
}

export const DragDropZone = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  disabled = false,
}: DragDropZoneProps) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
        isDragOver
          ? "border-blue-500 bg-blue-50 scale-[1.02]"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-700">
          {isDragOver ? "Drop images here" : "Drag & drop images here"}
        </p>
        <p className="text-sm text-gray-500">or</p>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          disabled={disabled}
          type="button"
        >
          Browse Files
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Supports: JPG, PNG, GIF, WebP • Max 10MB per file
      </p>
    </div>
  );
};