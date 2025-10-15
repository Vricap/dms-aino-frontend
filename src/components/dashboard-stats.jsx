import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, FileSignature, Clock, CheckCircle } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">142</div>
          <p className="text-xs text-muted-foreground">+12 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-sm font-medium">
              Signed Documents
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98</div>
          <p className="text-xs text-muted-foreground">+8 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-sm font-medium">
              Request Signatures
            </CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">+3 from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-sm font-medium">
              Uploaded Documents
            </CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">30</div>
          <p className="text-xs text-muted-foreground">+5 from last week</p>
        </CardContent>
      </Card>
    </div>
  );
}
