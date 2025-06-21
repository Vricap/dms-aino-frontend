import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileSignature, Clock } from "lucide-react";

const pendingSignatures = [
  {
    id: 1,
    name: "Project Proposal.docx",
    date: "Today, 3:45 PM",
    urgent: true,
  },
  {
    id: 2,
    name: "Partnership Agreement.pdf",
    date: "Yesterday, 11:20 AM",
    urgent: false,
  },
  {
    id: 3,
    name: "NDA Document.pdf",
    date: "Mar 22, 2023",
    urgent: false,
  },
];

export function PendingSignatures() {
  return (
    <div className="space-y-4">
      {pendingSignatures.map((document) => (
        <div
          key={document.id}
          className="flex flex-col gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <FileSignature className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{document.name}</p>
                {document.urgent && (
                  <Badge
                    variant="destructive"
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
                  >
                    Urgent
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{document.date}</span>
              </div>
            </div>
          </div>
          <Button size="sm" className="w-full">
            Sign Document
          </Button>
        </div>
      ))}
    </div>
  );
}
