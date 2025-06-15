import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.tsx";
import { Badge } from "../components/ui/badge.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar.tsx";
import {
  Search,
  Filter,
  Download,
  FileText,
  FileSignature,
  Eye,
  Upload,
  Trash,
} from "lucide-react";

export default function AuditTrailPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground">
            Track all document activities and user actions
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex w-full md:w-1/2 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search audit logs..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="sign">Sign</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.action === "Upload" && (
                        <Upload className="h-4 w-4 text-blue-500" />
                      )}
                      {log.action === "Download" && (
                        <Download className="h-4 w-4 text-green-500" />
                      )}
                      {log.action === "View" && (
                        <Eye className="h-4 w-4 text-yellow-500" />
                      )}
                      {log.action === "Sign" && (
                        <FileSignature className="h-4 w-4 text-purple-500" />
                      )}
                      {log.action === "Delete" && (
                        <Trash className="h-4 w-4 text-red-500" />
                      )}
                      <Badge
                        variant="outline"
                        className={
                          log.action === "Upload"
                            ? "border-blue-500 text-blue-500"
                            : log.action === "Download"
                              ? "border-green-500 text-green-500"
                              : log.action === "View"
                                ? "border-yellow-500 text-yellow-500"
                                : log.action === "Sign"
                                  ? "border-purple-500 text-purple-500"
                                  : "border-red-500 text-red-500"
                        }
                      >
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.action === "Sign" ? (
                        <FileSignature className="h-4 w-4 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                      <span>{log.document}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={log.user.avatar}
                          alt={log.user.name}
                        />
                        <AvatarFallback>{log.user.initials}</AvatarFallback>
                      </Avatar>
                      <span>{log.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{log.datetime}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const auditLogs = [
  {
    id: 1,
    action: "Upload",
    document: "Contract Agreement.pdf",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    datetime: "Today, 10:30 AM",
    ipAddress: "192.168.1.1",
  },
  {
    id: 2,
    action: "Sign",
    document: "Contract Agreement.pdf",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    datetime: "Today, 10:45 AM",
    ipAddress: "192.168.1.1",
  },
  {
    id: 3,
    action: "View",
    document: "Project Proposal.docx",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    datetime: "Yesterday, 3:45 PM",
    ipAddress: "192.168.1.2",
  },
  {
    id: 4,
    action: "Download",
    document: "Financial Report.xlsx",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    datetime: "Mar 22, 2023",
    ipAddress: "192.168.1.3",
  },
  {
    id: 5,
    action: "Upload",
    document: "Meeting Minutes.pdf",
    user: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    datetime: "Mar 20, 2023",
    ipAddress: "192.168.1.4",
  },
  {
    id: 6,
    action: "Delete",
    document: "Old Contract.pdf",
    user: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DW",
    },
    datetime: "Mar 15, 2023",
    ipAddress: "192.168.1.5",
  },
  {
    id: 7,
    action: "Sign",
    document: "Partnership Agreement.pdf",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    datetime: "Mar 10, 2023",
    ipAddress: "192.168.1.2",
  },
];
