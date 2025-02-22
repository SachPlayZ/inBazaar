"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export function UserButton() {
  const { user, logout } = useUser();
  const router = useRouter();

  if (!user) {
    return (
      <Button
        onClick={() => router.push("/signup")}
        variant="outline"
        className="font-medium"
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-medium gap-2">
          <User className="h-4 w-4" />
          {user.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between">
          <span>Role</span>
          <span className="font-medium">{user.role}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <span>User ID</span>
          <span className="font-medium">{user.userId}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
