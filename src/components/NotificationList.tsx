
import React from "react";
import { Link } from "react-router-dom";
import { Bell, Check, File, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotification } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const NotificationList: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "document":
        return <File className="h-4 w-4" />;
      case "status":
        return <RefreshCw className="h-4 w-4" />;
      case "deal":
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs h-8"
          >
            <Check className="mr-1 h-3 w-3" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No notifications
        </div>
      ) : (
        <ScrollArea className="max-h-[350px]">
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.dealId ? `/deals/${notification.dealId}` : "#"}
                className={cn(
                  "flex items-start p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0",
                  !notification.read && "bg-accent/40"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full mr-3",
                    !notification.read ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <span className="w-2 h-2 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default NotificationList;
