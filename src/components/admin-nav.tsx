
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Tag, ShoppingCart } from 'lucide-react';

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 md:gap-0 md:flex-col md:space-y-2 overflow-x-auto whitespace-nowrap pb-4 mb-4 md:pb-0 md:mb-0 border-b md:border-b-0 md:border-r md:pr-6 md:w-48 flex-shrink-0">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))
                ? "bg-muted text-primary font-semibold"
                : ""
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
