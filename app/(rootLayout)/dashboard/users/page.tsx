"use client";

import { useUserManagement } from "@/hooks/useUserManagement";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { deleteUser } from "@/apiServices/users/api.usersServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Search,
  Ban,
  ShieldCheck,
  CreditCard,
  ArrowUp,
  DollarSign,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function UsersPage() {
  const {
    users,
    isLoading,
    searchText,
    isPremiumFilter,
    accountTypeFilter,
    isToggling,
    setSearchText,
    setIsPremiumFilter,
    setAccountTypeFilter,
    toggleStatus,
    toggleBlock,
    togglePaid,
    performUpgrade,
    pagination,
    setPage,
    setLimit,
  } = useUserManagement();

  const { handleDelete, deleteDialog } = useDeleteDialog({
    deleteFn: deleteUser,
    invalidateKey: ["users"],
    successMessage: "User deleted successfully",
    errorMessage: "Failed to delete user",
    itemType: "user",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage admin users and their account permission here.{" "}
          </p>
        </div>
        <Button className="bg-primary-green text-base font-normal text-white hover:bg-primary-green">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-card rounded-md border-border">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold">All Users</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={isPremiumFilter}
                onValueChange={setIsPremiumFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="true">Paid</SelectItem>
                  <SelectItem value="false">Free</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={accountTypeFilter}
                onValueChange={setAccountTypeFilter}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>User</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
                : users?.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-[#111827]">
                            {user.name}
                          </p>
                          <p className="text-sm text-[#4B5563] font-medium">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.mobileNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.locations.length > 0
                        ? user.locations.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          user.isPaid
                            ? "bg-[#FFF7E6] rounded-full border border-[#FFD591] text-[#D46B08]"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.isPaid ? "Paid" : "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          user.status === "active"
                            ? "bg-[#F0FFF3] rounded-full border border-[#BAFFAA] text-primary-green"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.joinedAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isToggling === user.id}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toggleStatus(user.id, user.status)
                            }
                            disabled={isToggling === user.id}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toggleBlock(user.id, user.isBlocked)
                            }
                            disabled={isToggling === user.id}
                          >
                            {user.isBlocked ? (
                              <>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Block
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              togglePaid(user.id, user.isPaid)
                            }
                            disabled={isToggling === user.id}
                          >
                            {user.isPaid ? (
                              <>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Revoke Paid
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Make Paid
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => performUpgrade(user.id)}
                            disabled={isToggling === user.id}
                          >
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Upgrade
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
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
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        isLoading={isLoading}
      />

      {deleteDialog}
    </div>
  );
}