"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMedia, deleteMedia } from "@/apiServices/media/api.mediaServices";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MediaSidebar } from "./MediaSidebar";
import { MediaGrid } from "./MediaGrid";
import { ImageUpload } from "./ImageUpload";

interface MediaCardProps {
  onSelectionChange?: (selected: { id: string; url: string }[]) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ onSelectionChange }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const itemsPerPage = 20;
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ["media", currentPage, itemsPerPage],
    queryFn: () => getMedia({ page: currentPage, limit: itemsPerPage }),
    refetchOnMount: false,
  });

  const filteredMedia = useMemo(() => {
    if (!media?.data) return [];
    let filtered = media.data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return filtered;
  }, [media, search, filter]);

  const totalPages = media?.pagination?.pages || 1;
  const paginatedMedia = filteredMedia;

  const handleSelectionChange = (selected: { id: string; url: string }[]) => {
    setSelectedImages(selected.map((s) => s.id));
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  };

  const handleDelete = async (public_id: string) => {
    try {
      await deleteMedia(public_id);
      queryClient.invalidateQueries({ queryKey: ["media"] });
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Tabs defaultValue="library" className="h-[80vh]">
      <TabsList className="grid bg-primary-green rounded-sm w-60 h-11 grid-cols-2">
        <TabsTrigger className="text-white data-[state=active]:text-black" value="upload">Upload</TabsTrigger>
        <TabsTrigger value="library">Library</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="h-full">
        <ImageUpload />
      </TabsContent>

      <TabsContent value="library" className="h-full">
        <div className="flex h-full overflow-hidden">
          <MediaSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center space-x-4 p-4 bg-gray-300 border-b border-border">
              <Input
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-11 border-zinc-400 bg-white"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 border-zinc-400 bg-white h-11 cursor-pointer">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="name">
                    Sort by Name
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="date">
                    Sort by Date
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <MediaGrid
              media={paginatedMedia}
              selectedImages={selectedImages}
              onSelectionChange={handleSelectionChange}
              onDelete={handleDelete}
            />

            <div
              className="p-2 bg-background border "
              style={{ borderLeft: "none" }}
            >
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MediaCard;
