"use client";
import { useQuery } from "@tanstack/react-query";
import { getQueries, QueryData, deleteQuery, QueriesResponse } from "@/apiServices/queries/api.queriesServices";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export default function QueriesPage() {
  const { data, isLoading } = useQuery<QueriesResponse>({
    queryKey: ["queries"],
    queryFn: async () => {
      const res = await getQueries();
      return res.data;
    },
  });

  const router = useRouter();

  const { handleDelete, DeleteModal } = useDeleteDialog({
    deleteFn: deleteQuery,
    invalidateKey: ["queries"],
    successMessage: "Query deleted successfully",
    errorMessage: "Failed to delete query",
    itemType: "query",
  });

  const handleEdit = (queryId: string) => {
    router.push(`/dashboard/queries/edit/${queryId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Queries</h1>
        <Link href="/dashboard/queries/create">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="mr-2 h-4 w-4" /> Create Query
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.queries?.map((query: QueryData) => (
            <TableRow key={query._id}>
              <TableCell>{query.subject}</TableCell>
              <TableCell>{query.email}</TableCell>
              <TableCell>{query.phoneNumber}</TableCell>
              <TableCell>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    query.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : query.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {query.status}
                </span>
              </TableCell>
              <TableCell className="max-w-xs truncate">{query.description}</TableCell>
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

      <DeleteModal />
    </div>
  );
}