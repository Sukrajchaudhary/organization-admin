import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface StatusMessagesProps {
  isError: boolean;
  error: any;
  isSuccess: boolean;
  uploadProgress: number;
  validFilesCount: number;
  hasErrors: boolean;
  invalidFilesCount: number;
}

export const StatusMessages = ({
  isError,
  error,
  isSuccess,
  uploadProgress,
  validFilesCount,
  hasErrors,
  invalidFilesCount,
}: StatusMessagesProps) => {
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Upload failed. Please check your connection and try again."}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && uploadProgress === 100 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Successfully uploaded {validFilesCount} image(s)! The media library has been updated.
          </AlertDescription>
        </Alert>
      )}

      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {invalidFilesCount} file(s) cannot be uploaded due to validation errors.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};