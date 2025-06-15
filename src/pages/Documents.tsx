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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { Badge } from "../components/ui/badge.tsx";
import {
  FileText,
  FileSignature,
  MoreHorizontal,
  Download,
  Share,
  Trash,
  Search,
  Plus,
  Filter,
} from "lucide-react";

export default function Documents() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize all your documents
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex w-full md:w-1/2 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Modified</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {document.status === "Signed" ? (
                        <FileSignature className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                      <span className="font-medium">{document.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.date}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="mr-2 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

const documents = [
  {
    id: 1,
    name: "Contract Agreement.pdf",
    type: "PDF",
    status: "Signed",
    date: "Today, 10:30 AM",
    size: "1.2 MB",
  },
  {
    id: 2,
    name: "Project Proposal.docx",
    type: "DOCX",
    status: "Pending",
    date: "Yesterday, 3:45 PM",
    size: "845 KB",
  },
  {
    id: 3,
    name: "Financial Report.xlsx",
    type: "XLSX",
    status: "Viewed",
    date: "Mar 22, 2023",
    size: "2.1 MB",
  },
  {
    id: 4,
    name: "Meeting Minutes.pdf",
    type: "PDF",
    status: "Draft",
    date: "Mar 20, 2023",
    size: "567 KB",
  },
  {
    id: 5,
    name: "Marketing Plan.pptx",
    type: "PPTX",
    status: "Signed",
    date: "Mar 15, 2023",
    size: "3.4 MB",
  },
  {
    id: 6,
    name: "Employee Handbook.pdf",
    type: "PDF",
    status: "Signed",
    date: "Mar 10, 2023",
    size: "4.2 MB",
  },
  {
    id: 7,
    name: "Product Roadmap.docx",
    type: "DOCX",
    status: "Pending",
    date: "Mar 5, 2023",
    size: "1.1 MB",
  },
];
