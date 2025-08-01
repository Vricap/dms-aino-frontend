import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { FileUploadArea } from "../components/file-upload-area";
import { RecentDocuments } from "../components/recent-documents";
import { PendingSignatures } from "../components/pending-signatures";
import { DashboardStats } from "../components/dashboard-stats";
import { FileText, FileSignature, Clock, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Document Management System
          </h1>
          <p className="text-muted-foreground">
            Platform untuk memanajemen, tanda tangan dan track dokumen PT. AINO.
          </p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Upload new documents or request signatures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUploadArea />
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-4 h-full">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileSignature className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2 text-center">
                      <h3 className="font-medium">Request Signature</h3>
                      <p className="text-sm text-muted-foreground">
                        Send documents for digital signature
                      </p>
                    </div>
                    <Button className="mt-2">Request Signature</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>
                Documents requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingSignatures />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>
                  Your recently accessed documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDocuments />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Documents</CardTitle>
                <CardDescription>
                  Browse and manage all your documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Document library will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="search">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Search Documents</CardTitle>
                <CardDescription>
                  Find documents by name, type, or content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search functionality will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
