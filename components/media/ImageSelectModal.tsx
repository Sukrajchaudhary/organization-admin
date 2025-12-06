"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MediaCard from "./MediaCard";

interface ImageSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrl: string) => void;
}

export default function ImageSelectModal({ open, onOpenChange, onSelect }: ImageSelectModalProps) {
  const handleSelectionChange = (selected: { id: string; url: string }[]) => {
    if (selected.length > 0) {
      onSelect(selected[0].url);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[80vw] flex justify-center items-center flex-col overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>
          <div className="h-full w-full">
            <MediaCard onSelectionChange={handleSelectionChange} />
          </div>
      </DialogContent>
    </Dialog>
  );
}