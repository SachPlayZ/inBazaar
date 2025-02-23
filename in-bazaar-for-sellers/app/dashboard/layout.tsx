"use client";

import React from "react";
import {
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Plus,
} from "lucide-react";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-primary">
              Seller Dashboard
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase text-muted-foreground">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/dashboard"
                        className="flex items-center px-6 py-2 hover:bg-accent"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Overview</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/dashboard/inventory"
                        className="flex items-center px-6 py-2 hover:bg-accent"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        <span>Inventory</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/dashboard/sales"
                        className="flex items-center px-6 py-2 hover:bg-accent"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Sales</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/dashboard/customers"
                        className="flex items-center px-6 py-2 hover:bg-accent"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        <span>Customers</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="/dashboard/settings"
                        className="flex items-center px-6 py-2 hover:bg-accent"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex w-0 flex-1 flex-col">
          <header className="border-b bg-card">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="mr-2 md:hidden" />
              <div className="ml-auto flex items-center space-x-4">
                <Button
                  onClick={() => router.push("/dashboard/products/add")}
                  size="sm"
                  className="hidden md:flex"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Search />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
