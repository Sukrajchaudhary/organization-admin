import { useState } from "react";
import Image from "next/image";
import { Check, Trash2 } from "lucide-react";

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
}

export function MediaGrid({ media, selectedImages, onSelectionChange, onDelete }: MediaGridProps) {
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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-wrap gap-4">
        {media.map((item) => (
          <div
            key={item._id}
            className="relative cursor-pointer rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
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
              <div className="absolute top-1 right-1 bg-white rounded-full p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            )}
            {hoveredItem === item._id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <button
                  onClick={(e) => handleDelete(e, item.public_id)}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}