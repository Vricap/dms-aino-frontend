import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  FileText,
  FileSignature,
  LayoutDashboard,
  FolderOpen,
  UploadIcon,
  FileCheck,
  User,
  FileBox,
  Send,
} from "lucide-react";

const mainItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Upload", href: "/upload", icon: UploadIcon },
];

const documentItems = [
  { title: "Draft", href: "/draft", icon: FileText },
  { title: "Sent", href: "/send", icon: Send },
  { title: "Inbox", href: "/inbox", icon: FolderOpen },
  { title: "Completed", href: "/completed", icon: FileCheck },
  { title: "Signed", href: "/signed", icon: FileSignature },
];

export function Sidebar() {
  const location = useLocation();
  const isAdmin = localStorage.getItem("role") === "admin";

  const renderLink = (item) => (
    <Link
      key={item.href}
      to={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        "hover:bg-accent hover:text-accent-foreground",
        location.pathname === item.href
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground",
      )}
    >
      {location.pathname === item.href && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-primary" />
      )}
      <item.icon className="h-5 w-5" />
      {item.title}
    </Link>
  );

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
          D
        </div>
        <div>
          <p className="font-semibold">DMS</p>
          <p className="text-xs text-muted-foreground">PT. AINO</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase">
          Main
        </p>
        {mainItems.map(renderLink)}

        <p className="px-3 pt-4 text-xs font-semibold text-muted-foreground uppercase">
          Documents
        </p>
        {documentItems.map(renderLink)}

        {isAdmin && (
          <>
            <p className="px-3 pt-4 text-xs font-semibold text-muted-foreground uppercase">
              Admin
            </p>
            {renderLink({ title: "Users", href: "/users", icon: User })}
            {renderLink({
              title: "Documents",
              href: "/documents",
              icon: FileBox,
            })}
          </>
        )}
      </nav>
    </aside>
  );
}
