import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Send, Inbox, FileSignature, CheckCircle, Upload } from "lucide-react";
import BarChart from "../components/bar-chart.jsx";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = async (period) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/dashboard/?period=${period}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      setDashboard(response.data.data);
    } catch (err) {
      setError(`Gagal dalam load dashboard. ${err.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments("all");
  }, []);

  if (loading) {
    return <p className="p-4">Loading documents...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

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

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-sm font-medium">
                  Dokumen Ter-upload
                </CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.uploaded}</div>
              {/* <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>*/}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-sm font-medium">
                  Dokumen Dikirim
                </CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.sended}</div>
              {/* <p className="text-xs text-muted-foreground">
                +8 from last month
              </p>*/}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-sm font-medium">
                  Dokumen Inbox
                </CardTitle>
                <Inbox className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.inbox}</div>
              {/* <p className="text-xs text-muted-foreground">
                +8 from last month
              </p>*/}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-sm font-medium">
                  Dokumen Complete
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.complete}</div>
              {/* <p className="text-xs text-muted-foreground">+3 from last week</p>*/}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <CardTitle className="text-sm font-medium">
                  Telah Menanda Tangani
                </CardTitle>
                <FileSignature className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.signed}</div>
              {/* <p className="text-xs text-muted-foreground">+5 from last week</p>*/}
            </CardContent>
          </Card>
        </div>
      </div>
      <Button className="mt-4 text-left p-1" variant="outline">
        <select className="bg-background w-full h-full p-2">
          <option key="all" value="all" onClick={() => fetchDocuments("all")}>
            Semua
          </option>
          <option
            key="daily"
            value="daily"
            onClick={() => fetchDocuments("daily")}
          >
            Hari Ini
          </option>
          <option
            key="weekly"
            value="weekly"
            onClick={() => fetchDocuments("weekly")}
          >
            Minggu Ini
          </option>
          <option
            key="monthly"
            value="monthly"
            onClick={() => fetchDocuments("monthly")}
          >
            Bulan Ini
          </option>
        </select>
      </Button>
      <div className="p-4">
        <BarChart values={dashboard} />
      </div>
    </main>
  );
}
