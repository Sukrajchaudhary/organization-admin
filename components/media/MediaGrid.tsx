import { useState } from "react";
import Image from "next/image";
import { Check, Trash2 } from "lucide-react";
import { MediaCardSkeleton } from "./MediaCardSkeleton";

interface MediaItem {
  _id: string;
  name: string;
  cdn: string;
  public_id: string;
}

interface MediaGridProps {
  media: MediaItem[];
  selectedImages: string[];
  onSelectionChange: (selected: { id: string; url: string }[]) => void;
  onDelete?: (public_id: string) => void;
  isLoading?: boolean;
}

export function MediaGrid({ media, selectedImages, onSelectionChange, onDelete, isLoading }: MediaGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleClick = (item: MediaItem) => {
    const newSelected = selectedImages.includes(item._id)
      ? selectedImages.filter(id => id !== item._id)
      : [...selectedImages, item._id];
    const selectedItems = newSelected.map(id => {
      const foundItem = media.find(m => m._id === id);
      return foundItem ? { id, url: foundItem.cdn } : null;
    }).filter(Boolean) as { id: string; url: string }[];
    onSelectionChange(selectedItems);
  };

  const handleDelete = (e: React.MouseEvent, public_id: string) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(public_id);
    }
  };

  if (isLoading) {
    return <MediaCardSkeleton />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-wrap gap-4">
        {media.map((item) => (
          <div
            key={item._id}
            className="relative cursor-pointer rounded-sm overflow-hidden border border-[#D9D9D9] hover:shadow-lg transition-shadow"
            style={{ width: "120px", height: "120px" }}
            onClick={() => handleClick(item)}
            onMouseEnter={() => setHoveredItem(item._id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Image
              src={item.cdn}
              alt={item.name}
              height={120}
              width={120}
              className="object-cover"
            />
            {selectedImages.includes(item._id) && (
              <div className="absolute top-0.5 left-0.5 bg-primary-green rounded-sm ">
                <Check className="h-5 w-5 font-semibold text-white" />
              </div>
            )}
            {hoveredItem === item._id && (
              <div className="absolute cursor-pointer top-0 right-0 flex items-center justify-center">
                <button
                  onClick={(e) => handleDelete(e, item.public_id)}
                  className="bg-red-500 cursor-pointer text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}