"use client";

import { useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MoreHorizontal, Edit, Trash2, Upload, Plus } from "lucide-react";
import { formatDate, truncateText, stripHtml } from "@/lib/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/api";

// Column definition for table
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

// Status styles mapping
const STATUS_STYLES = {
  published: "bg-emerald-500/10 text-emerald-500",
  draft: "bg-amber-500/10 text-amber-500",
  archived: "bg-gray-500/10 text-gray-500",
} as const;

// Props interface
interface CrudTableProps<T extends { _id: string; status?: string }> {
  // Data fetching
  queryKey: string;
  fetchFn: (params: { page: number; limit: number }) => Promise<ApiResponse<T[]>>;

  // CRUD operations
  deleteFn: (id: string) => Promise<any>;
  updateFn?: (id: string, data: Partial<T>) => Promise<any>;

  // UI Configuration
  title: string;
  description: string;
  itemName: string;
  createPath: string;
  editPath: string;

  // Table columns
  columns: TableColumn<T>[];

  // Optional customization
  limit?: number;
  additionalInvalidateKeys?: string[];
  showPublishAction?: boolean;
}

export function CrudTable<T extends { _id: string; status?: string; createdAt?: string }>({
  queryKey,
  fetchFn,
  deleteFn,
  updateFn,
  title,
  description,
  itemName,
  createPath,
  editPath,
  columns,
  limit = 10,
  additionalInvalidateKeys = [],
  showPublishAction = true,
}: CrudTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch data
  const { data: response, isLoading } = useQuery({
    queryKey: [queryKey, currentPage],
    queryFn: () => fetchFn({ page: currentPage, limit }),
    refetchOnMount: true,
    staleTime: 0,
  });

  const items = response?.data || [];
  const pagination = response?.pagination;

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map((item) => item._id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  // Delete handler
  const { handleDelete, deleteDialog } = useDeleteDialog({
    deleteFn,
    invalidateKey: [queryKey],
    successMessage: `${itemName} deleted successfully`,
    errorMessage: `Failed to delete ${itemName.toLowerCase()}`,
    itemType: itemName,
  });

  // Publish handler
  const handlePublish = async (itemId: string) => {
    if (!updateFn) return;

    try {
      const res = await updateFn(itemId, { status: "published" } as Partial<T>);
      toast({
        variant: "default",
        title: "Success",
        description: res.message || `${itemName} published successfully`,
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      additionalInvalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to publish ${itemName.toLowerCase()}`,
        variant: "destructive",
      });
    }
  };

  // Render cell content
  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(item);
    }

    const value = item[column.key as keyof T];

    // Handle status specially
    if (column.key === "status" && typeof value === "string") {
      return (
        <Badge
          variant="secondary"
          className={STATUS_STYLES[value as keyof typeof STATUS_STYLES] || STATUS_STYLES.draft}
        >
          {value}
        </Badge>
      );
    }

    // Handle dates
    if (column.key === "createdAt" && typeof value === "string") {
      return <span className="text-muted-foreground">{formatDate(value)}</span>;
    }

    // Default text rendering
    if (typeof value === "string") {
      return truncateText(stripHtml(value), 50);
    }

    return String(value ?? "");
  };

  // Skeleton row
  const renderSkeletonRow = (index: number) => (
    <TableRow key={index} className="border-border">
      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
      {columns.map((col, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <Link href={createPath}>
          <Button className="bg-primary-green text-base font-normal text-white hover:bg-primary-green">
            <Plus className="h-4 w-4 mr-2" />
            Add {itemName}
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === items.length && items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => renderSkeletonRow(i))
                : items.map((item) => (
                    <TableRow key={item._id} className="border-border">
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item._id)}
                          onCheckedChange={(checked) =>
                            handleSelectItem(item._id, checked as boolean)
                          }
                        />
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell
                          key={String(column.key)}
                          className={column.className}
                        >
                          {renderCell(item, column)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`${editPath}/${item._id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {showPublishAction && updateFn && (
                              <DropdownMenuItem onClick={() => handlePublish(item._id)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(item._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(pagination.pages, currentPage + 1))
                    }
                    className={
                      currentPage === pagination.pages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {deleteDialog}
    </div>
  );
}

export default CrudTable;