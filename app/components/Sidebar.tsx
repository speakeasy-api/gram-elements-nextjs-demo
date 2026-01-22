"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  icon: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  { name: "Overview", icon: "📊", href: "/" },
  { name: "Products", icon: "🍌", href: "/products" },
  { name: "Sales", icon: "💰", href: "/sales" },
];

const bottomNavItems: NavItem[] = [
  { name: "Team", icon: "👥", href: "/team" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-88px)] flex flex-col">
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-yellow-100 text-yellow-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-6 border-t border-gray-200" />

        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-yellow-100 text-yellow-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
