
import React from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import NotificationList from "./NotificationList";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold">
              dealmate
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/create-deal">
                <Button size="sm" variant="secondary">
                  <Plus className="mr-1 h-4 w-4" />
                  New Deal
                </Button>
              </Link>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 px-1.5 py-px min-w-[1.25rem] h-5 flex items-center justify-center"
                        variant="destructive"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 max-h-[400px] overflow-hidden"
                >
                  <NotificationList />
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
