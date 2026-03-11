"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onMenuClick?: () => void;
  showSearch?: boolean;
}

export function Header({
  title,
  userName = "Admin User",
  userEmail = "admin@example.com",
  userAvatar,
  onMenuClick,
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        )}
        {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="hidden md:block w-64">
            <Input
              placeholder="Search..."
              leftIcon={<Search className="h-3.5 w-3.5" />}
              className="h-8 text-xs"
            />
          </div>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors">
              <Avatar className="h-8 w-8">
                {userAvatar && <AvatarImage src={userAvatar} />}
                <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800">{userName}</p>
                <p className="text-xs text-slate-400">{userEmail}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
