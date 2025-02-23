"use client";

import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, LogOut, Store, User, ShoppingBag } from "lucide-react";

export function UserNav() {
  const { logout } = useAuth();
  const user = authService.getCurrentSeller();
  console.log(user);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name ? getInitials(user.name) : "S"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || "Seller"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Store className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm">Shop</span>
              <span className="text-xs text-muted-foreground">
                {user?.shopName || "My Store"}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm">Products</span>
              <span className="text-xs text-muted-foreground">
                {user?.totalProducts || 0} products listed
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Package className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm">Orders</span>
              <span className="text-xs text-muted-foreground">
                {user?.ordersCompleted || 0} completed
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
