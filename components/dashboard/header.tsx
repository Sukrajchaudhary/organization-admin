"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getAllNotifications } from "@/apiServices/notifications/api.notifications";
import {formatDateTime } from "@/lib/common";

export function Header() {
  const { data: session } = useSession();
  const { data: NotificationData } = useQuery({
    queryKey: ["Notification"],
    queryFn: () => getAllNotifications({ page: 1, limit: 100 }),
  });
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-secondary border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5  w-5" />
              <span className="absolute bg-red-400 top-1 right-1 h-2 w-2  rounded-full" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[450px]  max-h-[50vh]  overflow-y-auto">
            <div className="space-y-4 p-2">
              <h4 className="font-medium leading-none">Notifications</h4>
              {NotificationData?.data.map((noti, index) => (
                <>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {noti.message}
                        </p>
                        <p className="text-sm font-medium">
                          {formatDateTime(noti.createdAt)}
                        </p>
                        <p className="text-xs font-normal text-muted-foreground">
                          {noti.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {session?.user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
