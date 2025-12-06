import { X } from "lucide-react";

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  error?: string;
}

interface FilePreviewItemProps {
  file: FileWithPreview;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const FilePreviewItem = ({
  file,
  onRemove,
  disabled = false,
}: FilePreviewItemProps) => {
  return (
    <div className="relative group">
      <div
        className={`aspect-square rounded-lg overflow-hidden border-2 ${
          file.error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
        }`}
      >
        <img
          src={file.preview}
          alt={file.file.name}
          className={`w-full h-full object-cover ${
            file.error ? "opacity-50" : ""
          }`}
          onError={(e) => {
            console.error("Image load error:", file.file.name);
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Remove button */}
      <button
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
        onClick={() => onRemove(file.id)}
        disabled={disabled}
        type="button"
      >
        <X className="h-3 w-3" />
      </button>

      {/* File info */}
      <div className="absolute bottom-0 left-0 right-0  from-black/70 to-transparent p-2">
        <p className="text-xs text-white truncate" title={file.file.name}>
          {file.file.name}
        </p>
        <p className="text-xs text-gray-300">
          {(file.file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      {/* Error indicator */}
      {file.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
          <div className="bg-white rounded-lg p-2 shadow-lg max-w-[90%]">
            <p className="text-xs text-red-600 font-medium">{file.error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
