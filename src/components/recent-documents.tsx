import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Badge } from "./ui/badge.tsx";
import { FileText, FileSignature, Clock } from "lucide-react";

const recentDocuments = [
  {
    id: 1,
    name: "Contract Agreement.pdf",
    type: "PDF",
    status: "Signed",
    date: "Today, 10:30 AM",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
  },
  {
    id: 2,
    name: "Project Proposal.docx",
    type: "DOCX",
    status: "Pending",
    date: "Yesterday, 3:45 PM",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
  },
  {
    id: 3,
    name: "Financial Report.xlsx",
    type: "XLSX",
    status: "Viewed",
    date: "Mar 22, 2023",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
  },
  {
    id: 4,
    name: "Meeting Minutes.pdf",
    type: "PDF",
    status: "Draft",
    date: "Mar 20, 2023",
    user: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
  },
];

export function RecentDocuments() {
  return (
    <div className="space-y-4">
      {recentDocuments.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              {document.status === "Signed" ? (
                <FileSignature className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium">{document.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{document.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                document.status === "Signed"
                  ? "success"
                  : document.status === "Pending"
                    ? "warning"
                    : document.status === "Draft"
                      ? "outline"
                      : "secondary"
              }
              className={
                document.status === "Signed"
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600"
                  : document.status === "Pending"
                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-600"
                    : document.status === "Draft"
                      ? "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 hover:text-gray-600"
                      : ""
              }
            >
              {document.status}
            </Badge>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={document.user.avatar}
                alt={document.user.name}
              />
              <AvatarFallback>{document.user.initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      ))}
    </div>
  );
}
