"use client";

import { useState } from "react";
import {
  deleteTrip,
  getTrips,
  updateTrip,
} from "@/apiServices/trip/api.tripServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trip } from "@/types/trip/tripTypes";
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

const TripLayout = () => {
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data: Trips, isLoading } = useQuery({
    queryKey: ["trips", currentPage],
    queryFn: () => getTrips({ page: currentPage, limit }),
    refetchOnMount: false,
  });
  const trips = Trips?.data || [];
  const pagination = Trips?.pagination;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTrips(trips.map((trip) => trip._id));
    } else {
      setSelectedTrips([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedTrips([]);
  };

  const handleSelectTrip = (tripId: string, checked: boolean) => {
    if (checked) {
      setSelectedTrips((prev) => [...prev, tripId]);
    } else {
      setSelectedTrips((prev) => prev.filter((id) => id !== tripId));
    }
  };
  const { handleDelete, deleteDialog } = useDeleteDialog({
    deleteFn: deleteTrip,
    invalidateKey: ["trips"],
    successMessage: "Deleted successfully",
    errorMessage: "Failed to delete ",
    itemType: "Trip",
  });
  const handlePublish = async (tripId: string) => {
    try {
      const res = await updateTrip(tripId, { status: "published" });
      toast({
        variant: "default",
        title: "Success",
        description: `${res.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["trips"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish trip",
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
          <h1 className="text-2xl font-semibold">Trips Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage Trips and their status here.{" "}
          </p>
        </div>
        <Link href="/dashboard/trip/create">
          <Button className="bg-primary-green text-base font-normal text-white hover:bg-primary-green">
            <Plus className="h-4 w-4 mr-2" />
            Add Trip
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
                      selectedTrips.length === trips.length && trips.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Overview</TableHead>
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
                : trips.map((trip: Trip) => (
                  <TableRow key={trip._id} className="border-border">
                    <TableCell>
                      <Checkbox
                        checked={selectedTrips.includes(trip._id)}
                        onCheckedChange={(checked) =>
                          handleSelectTrip(trip._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {trip.title}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {truncateText(stripHtml(trip.overview), 50)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusStyles[
                          trip.status as keyof typeof statusStyles
                          ] || statusStyles.draft
                        }
                      >
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(trip.createdAt)}
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
                              router.push(`/dashboard/trip/edit/${trip._id}`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handlePublish(trip._id)}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(trip._id)}
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

export default TripLayout;