import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  getUsers, 
  deactivateUser, 
  activateUser, 
  blockUser, 
  unblockUser, 
  makeUserPaid, 
  revokeUserPaid, 
  upgradeUser 
} from "@/apiServices/users/api.usersServices";
import { User } from "@/types/authTypes/authType";

interface UserDisplay {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    joinedAt: string;
    mobileNumber: string;
    isPaid: boolean;
    locations: string[];
    isBlocked: boolean;
  }

export function useUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isPremiumFilter, setIsPremiumFilter] = useState<string>("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all");

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
    return () => clearTimeout(timer);
  };

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", debouncedSearch, isPremiumFilter, accountTypeFilter],
    queryFn: async (): Promise<UserDisplay[]> => {
      try {
        const response = await getUsers({
          search: debouncedSearch || undefined,
          isPremium: isPremiumFilter === "all" ? undefined : isPremiumFilter === "true",
          accountType: accountTypeFilter === "all" ? undefined : accountTypeFilter,
        });
        if (response.success && response.data) {
          return response.data.map((user: User) => ({
            id: user._id,
            name: user.fullName || user.username,
            email: user.email,
            role: user.role,
            status: user.isActive ? "active" : "inactive",
            joinedAt: new Date(user.createdAt).toLocaleDateString(),
            mobileNumber: user.mobileNumber || "-",
            isPaid: user.isPremium,
            locations: user.companyLocations || [],
            isBlocked: user.isBlocked,
          }));
        }
        return [];
      } catch (error) {
        return [];
      }
    },
    refetchOnMount: false,
  });

  const handleAction = async (
    userId: string,
    actionFn: () => Promise<any>,
    successMessage: string,
    errorMessage: string
  ) => {
    setIsToggling(userId);
    try {
      const response = await actionFn();
      toast({
        title: "Success",
        description: response.message || successMessage,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsToggling(null);
    }
  };

  const toggleStatus = (userId: string, currentStatus: "active" | "inactive") =>
    handleAction(
      userId,
      () => (currentStatus === "active" ? deactivateUser(userId) : activateUser(userId)),
      `User ${currentStatus === "active" ? "deactivated" : "activated"} successfully`,
      "Failed to update user status"
    );

  const toggleBlock = (userId: string, isBlocked: boolean) =>
    handleAction(
      userId,
      () => (isBlocked ? unblockUser(userId) : blockUser(userId)),
      `User ${isBlocked ? "unblocked" : "blocked"} successfully`,
      `Failed to ${isBlocked ? "unblock" : "block"} user`
    );

  const togglePaid = (userId: string, isPaid: boolean) =>
    handleAction(
      userId,
      () => (isPaid ? revokeUserPaid(userId) : makeUserPaid(userId)),
      `User ${isPaid ? "revoked from paid" : "marked as paid"} successfully`,
      "Failed to update payment status"
    );

  const performUpgrade = (userId: string) =>
    handleAction(
      userId,
      () => upgradeUser(userId),
      "User upgraded successfully",
      "Failed to upgrade user"
    );

  return {
    users,
    isLoading,
    searchText,
    isPremiumFilter,
    accountTypeFilter,
    isToggling,
    setSearchText: handleSearchChange, // Expose the handler wrapper
    setIsPremiumFilter,
    setAccountTypeFilter,
    toggleStatus,
    toggleBlock,
    togglePaid,
    performUpgrade, 
  };
}
