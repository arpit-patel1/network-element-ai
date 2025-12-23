"use client";

import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Desktop: Show email + logout */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {email}
        </span>
        <LogoutButton variant="outline" size="sm" />
      </div>
      
      {/* Mobile: Show dropdown menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Account</p>
                <p className="text-xs text-muted-foreground truncate">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-1">
              <LogoutButton variant="ghost" size="sm" showIcon className="w-full justify-start" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

