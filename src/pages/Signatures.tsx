import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar.tsx";
import {
  FileSignature,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Plus,
} from "lucide-react";

export default function Signatures() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Signatures</h1>
          <p className="text-muted-foreground">
            Manage document signatures and requests
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex w-full md:w-1/2 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search signatures..."
                className="w-full pl-8"
              />
            </div>
          </div>
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Request Signature
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              <Clock className="h-4 w-4 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="declined">
              <XCircle className="h-4 w-4 mr-2" />
              Declined
            </TabsTrigger>
            <TabsTrigger value="expired">
              <AlertCircle className="h-4 w-4 mr-2" />
              Expired
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingSignatures.map((signature) => (
                <SignatureCard key={signature.id} signature={signature} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedSignatures.map((signature) => (
                <SignatureCard key={signature.id} signature={signature} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="declined" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>No Declined Signatures</CardTitle>
                <CardDescription>
                  There are no declined signature requests at this time.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>No Expired Signatures</CardTitle>
                <CardDescription>
                  There are no expired signature requests at this time.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SignatureCard({ signature }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{signature.document}</CardTitle>
          </div>
          <Badge
            variant={
              signature.status === "Pending"
                ? "warning"
                : signature.status === "Completed"
                  ? "success"
                  : "outline"
            }
            className={
              signature.status === "Pending"
                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-600"
                : signature.status === "Completed"
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600"
                  : ""
            }
          >
            {signature.status}
          </Badge>
        </div>
        <CardDescription className="pt-1">
          {signature.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Requested by:</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={signature.requestedBy.avatar}
                  alt={signature.requestedBy.name}
                />
                <AvatarFallback>
                  {signature.requestedBy.initials}
                </AvatarFallback>
              </Avatar>
              <span>{signature.requestedBy.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Requested on:</div>
            <div>{signature.requestedDate}</div>
          </div>

          {signature.status === "Completed" && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">Completed on:</div>
              <div>{signature.completedDate}</div>
            </div>
          )}

          {signature.status === "Pending" ? (
            <Button className="w-full">Sign Document</Button>
          ) : (
            <Button variant="outline" className="w-full">
              View Document
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const pendingSignatures = [
  {
    id: 1,
    document: "Project Proposal.docx",
    description: "Proposal for the new mobile app project",
    status: "Pending",
    requestedBy: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    requestedDate: "Today, 3:45 PM",
  },
  {
    id: 2,
    document: "Partnership Agreement.pdf",
    description: "Legal agreement for the new partnership",
    status: "Pending",
    requestedBy: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    requestedDate: "Yesterday, 11:20 AM",
  },
  {
    id: 3,
    document: "NDA Document.pdf",
    description: "Non-disclosure agreement for the client project",
    status: "Pending",
    requestedBy: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    requestedDate: "Mar 22, 2023",
  },
];

const completedSignatures = [
  {
    id: 4,
    document: "Contract Agreement.pdf",
    description: "Service contract for the software development",
    status: "Completed",
    requestedBy: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    requestedDate: "Mar 15, 2023",
    completedDate: "Mar 16, 2023",
  },
  {
    id: 5,
    document: "Employee Handbook.pdf",
    description: "Updated company policies and procedures",
    status: "Completed",
    requestedBy: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DW",
    },
    requestedDate: "Mar 10, 2023",
    completedDate: "Mar 12, 2023",
  },
];
