import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  FileText,
  // FileSignature,
  // Users,
  // Settings,
  LayoutDashboard,
  FolderOpen,
  // History,
  UploadIcon,
  FileCheck,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Upload",
    href: "/upload",
    icon: UploadIcon,
  },
  {
    title: "Draft",
    href: "/draft",
    icon: FileText,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: FolderOpen,
  },
  {
    title: "Completed",
    href: "/completed",
    icon: FileCheck,
  },
  // {
  //   title: "Signatures",
  //   href: "/signatures",
  //   icon: FileSignature,
  // },
  // {
  //   title: "Audit Trail",
  //   href: "/audit",
  //   icon: History,
  // },
  // {
  //   title: "Users",
  //   href: "/users",
  //   icon: Users,
  // },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1 px-2 pt-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
