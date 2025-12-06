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
  hasErrors,
  invalidFilesCount,
}: Pick<StatusMessagesProps, 'hasErrors' | 'invalidFilesCount'>) => {
  return (
    <>
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