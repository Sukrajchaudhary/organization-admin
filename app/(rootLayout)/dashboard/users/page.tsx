"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Plus, Edit, Trash2, UserX, UserCheck } from "lucide-react";
import { getUsers, deactivateUser, deleteUser } from "@/apiServices/users/api.usersServices";
import { User } from "@/types/authTypes/authType";
import { useToast } from "@/hooks/use-toast";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useState } from "react";
interface UserDisplay {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinedAt: string;
}

async function fetchUsers(): Promise<UserDisplay[]> {
  try {
    const response = await getUsers();
    if (response.success && response.data) {
      return response.data.map((user: User) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: user.isActive ? "active" : "inactive",
        joinedAt: new Date(user.createdAt).toLocaleDateString(),
      }));
    }
    return [];
  } catch (error) {
    return [];
  }
}

export default function UsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    refetchOnMount: false,
  });

  const { handleDelete, deleteDialog } = useDeleteDialog({
    deleteFn: deleteUser,
    invalidateKey: ["users"],
    successMessage: "User deleted successfully",
    errorMessage: "Failed to delete user",
    itemType: "user",
  });

  const handleToggleStatus = async (userId: string, currentStatus: "active" | "inactive") => {
    setIsToggling(userId);
    try {
      const response = await deactivateUser(userId);
      toast({
        title: "Success",
        description: response.message || `User ${currentStatus === "active" ? "deactivated" : "activated"} successfully`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsToggling(null);
    }
  };

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

      <Card className="bg-card rounded-sm border-border">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
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
                        <Skeleton className="h-4 w-16" />
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
                            <p className="font-semibold text-[#111827]">{user.name}</p>
                            <p className="text-sm text-[#4B5563] font-medium">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
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
                            <Button variant="ghost" size="icon" disabled={isToggling === user.id}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user.id, user.status)}
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
      {deleteDialog}
    </div>
  );
}
