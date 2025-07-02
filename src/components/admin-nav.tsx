
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
    <nav className="flex flex-col space-y-2 border-r pr-6">
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
