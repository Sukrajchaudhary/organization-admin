"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueries, QueryData, deleteQuery, QueriesResponse } from "@/apiServices/queries/api.queriesServices";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { formatDate } from "@/lib/common";

export default function QueriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery<QueriesResponse>({
    queryKey: ["queries", currentPage],
    queryFn: async () => {
      const res = await getQueries({ page: currentPage, limit });
      return res.data;
    },
    refetchOnMount: false,
  });

  const queries = data?.queries || [];
  const pagination = data?.pagination;
  const router = useRouter();

  const { handleDelete, deleteDialog } = useDeleteDialog({
    deleteFn: deleteQuery,
    invalidateKey: ["queries"],
    successMessage: "Query deleted successfully",
    errorMessage: "Failed to delete query",
    itemType: "query",
  });

  const handleEdit = (queryId: string) => {
    router.push(`/dashboard/queries/edit/${queryId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const statusStyles = {
    resolved: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    "in-progress": "bg-blue-500/10 text-blue-500",
    ignored: "bg-gray-500/10 text-gray-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Queries Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage customer queries and their status here.
          </p>
        </div>
        <Link href="/dashboard/queries/create">
          <Button className="bg-primary-green text-base font-normal text-white hover:bg-primary-green">
            <Plus className="h-4 w-4 mr-2" />
            Add Query
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-64" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                : queries.map((query: QueryData) => (
                    <TableRow key={query._id} className="border-border">
                      <TableCell className="font-medium">{query.subject}</TableCell>
                      <TableCell>{query.email}</TableCell>
                      <TableCell>{query.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            statusStyles[query.status as keyof typeof statusStyles] ||
                            statusStyles.pending
                          }
                        >
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {query.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(query.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(query._id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(query._id)}
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