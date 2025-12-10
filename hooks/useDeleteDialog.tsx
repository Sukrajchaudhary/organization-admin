"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UseDeleteDialogProps {
  deleteFn: (id: string) => Promise<ApiResponse<void>>;
  invalidateKey: string[];
  successMessage?: string;
  errorMessage?: string;
  itemType?: string;
  onSuccess?: (deletedId: string) => void;
}

export const useDeleteDialog = ({
  deleteFn,
  invalidateKey,
  successMessage = "Deleted successfully",
  errorMessage = "Failed to delete",
  itemType = "item",
  onSuccess,
}: UseDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFn(idToDelete);
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: invalidateKey });
      onSuccess?.(idToDelete);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpen(false);
      setIdToDelete(null);
    }
  };

  const description = `This action cannot be undone. This will permanently delete the ${itemType}.`;

  const deleteDialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    handleDelete,
    deleteDialog,
  };
};