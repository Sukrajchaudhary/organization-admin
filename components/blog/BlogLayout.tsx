"use client";

import { useState } from "react";
import {
  deleteBlog,
  getBlogs,
  updateBlog,
} from "@/apiServices/blog/api.blogServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RootBlogsData } from "@/types/blogTypes/blogTypes";
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
import { useToast } from "../ui/use-toast";

const BlogLayout = () => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data: Blogs, isLoading } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: () => getBlogs({ page: currentPage, limit }),
    refetchOnMount: false,
  });
  const blogs = Blogs?.data || [];
  const pagination = Blogs?.pagination;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBlogs(blogs.map((blog) => blog._id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedBlogs([]);
  };

  const handleSelectBlog = (blogId: string, checked: boolean) => {
    if (checked) {
      setSelectedBlogs((prev) => [...prev, blogId]);
    } else {
      setSelectedBlogs((prev) => prev.filter((id) => id !== blogId));
    }
  };
  const { handleDelete, deleteDialog } = useDeleteDialog({
    deleteFn: deleteBlog,
    invalidateKey: ["blogs"],
    successMessage: "Deleted successfully",
    errorMessage: "Failed to delete ",
    itemType: "Blog",
  });
  const handlePublish = async (blogId: string) => {
    try {
      const res = await updateBlog(blogId, { status: "published" });
      toast({
        variant: "default",
        title: "Success",
        description: `${res.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish blog",
        variant: "destructive",
      });
    }
  };

  const statusStyles = {
    published: "bg-emerald-500/10 text-emerald-500",
    draft: "bg-amber-500/10 text-amber-500",
    archived: "bg-gray-500/10 text-gray-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blogs Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage Blogs and their status here.{" "}
          </p>
        </div>
        <Link href="/dashboard/blog/create">
          <Button className="bg-primary-green text-base font-normal text-white hover:bg-primary-green">
            <Plus className="h-4 w-4 mr-2" />
            Add Blog
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedBlogs.length === blogs.length && blogs.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
                : blogs.map((blog: RootBlogsData) => (
                  <TableRow key={blog._id} className="border-border">
                    <TableCell>
                      <Checkbox
                        checked={selectedBlogs.includes(blog._id)}
                        onCheckedChange={(checked) =>
                          handleSelectBlog(blog._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {blog.title}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {truncateText(stripHtml(blog.description), 50)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusStyles[
                          blog.status as keyof typeof statusStyles
                          ] || statusStyles.draft
                        }
                      >
                        {blog.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(blog.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/blog/edit/${blog._id}`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handlePublish(blog._id)}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(blog._id)}
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

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
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
                      handlePageChange(
                        Math.min(pagination.pages, currentPage + 1)
                      )
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
};

export default BlogLayout;
