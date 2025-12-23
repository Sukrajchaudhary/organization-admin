import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

export const FormSection = ({
  title,
  children,
  onAdd,
  addButtonText = "Add",
  className = "space-y-4 bg-gray-50 p-6 rounded-sm",
}: FormSectionProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {onAdd && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-2" />
            {addButtonText}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};