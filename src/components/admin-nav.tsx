
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
  ];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 border-b mb-6 pb-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
