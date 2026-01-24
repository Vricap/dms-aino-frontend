import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Send,
  Inbox,
  FileSignature,
  CheckCircle,
  Upload,
  FileText,
  SquareUser,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import BarChart from "../components/bar-chart.jsx";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    return (
      <main className="p-6">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <main className="container mx-auto py-6 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Document Management System
          </h1>
          <p className="text-muted-foreground">
            Platform manajemen dokumen PT. AINO yang memungkinkan pembuatan,
            penandatanganan, dan pelacakan dokumen secara digital, dengan
            dukungan <strong>sequential</strong>, <strong>parallel</strong>, dan{" "}
            <strong>group signing</strong>.
          </p>
        </div>

        {(dashboard.inbox > 0 || dashboard.saved > 0) && (
          <div className="mt-2">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Attention Required
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Inbox Attention */}
              {dashboard.inbox > 0 && (
                <Card className="border-l-4 border-yellow-500 bg-yellow-50 hover:shadow-md transition animate-in fade-in slide-in-from-top-2">
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium dark:text-black">
                        {dashboard.inbox} dokumen menunggu tanda tanganmu
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Segera tandatangani agar proses tidak terhambat
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/inbox")}
                      className="shrink-0 dark:bg-black dark:text-white hover:bg-gray-900"
                    >
                      Buka Inbox
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Draft Attention */}
              {dashboard.saved > 0 && (
                <Card className="border-l-4 border-blue-500 bg-blue-50 hover:shadow-md transition animate-in fade-in slide-in-from-top-2">
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium dark:text-black">
                        Kamu punya {dashboard.saved} draft yang belum dikirim
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Segera kirim dokumen untuk diproses
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/draft")}
                      className="shrink-0 dark:bg-black dark:text-white hover:bg-gray-900"
                    >
                      Lanjutkan Draft
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Uploaded */}
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Uploaded
                </CardTitle>
                <Upload className="h-4 w-4 text-sky-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.uploaded}</div>
              <p className="text-xs text-muted-foreground">
                Total dokumen yang telah kamu upload
              </p>
            </CardContent>
          </Card>

          {/* Drafted */}
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Drafted
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.saved}</div>
              <p className="text-xs text-muted-foreground">
                Dokumen mu yang tersimpan sebagai draft
              </p>
            </CardContent>
          </Card>

          {/* Sent */}
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Sent
                </CardTitle>
                <Send className="h-4 w-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.sended}</div>
              <p className="text-xs text-muted-foreground">
                Dokumen mu yang dikirim ke penerima
              </p>
            </CardContent>
          </Card>

          {/* Inbox */}
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Inbox
                </CardTitle>
                <Inbox className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.inbox}</div>
              <p className="text-xs text-muted-foreground">
                Dokumen menunggu tanda tanganmu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
          {/* Signed */}
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Signed
                </CardTitle>
                <FileSignature className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.signed}</div>
              <p className="text-xs text-muted-foreground">
                Dokumen yang telah kamu tanda tangani
              </p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.complete}</div>
              <p className="text-xs text-muted-foreground">
                Dokumen mu yang telah ditandatangani oleh semua penerima
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-2">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Distribusi Dokumen</CardTitle>
              <p className="text-sm text-muted-foreground">
                Overview dokumen dalam jangka waktu yang diplih
              </p>
              <Button className="mt-4 text-left p-1" variant="outline">
                <select className="bg-background w-full h-full p-2">
                  <option
                    key="all"
                    value="all"
                    onClick={() => fetchDocuments("all")}
                  >
                    Kapan Saja
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
            </CardHeader>
            <CardContent>
              <BarChart values={dashboard} />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-1">
                <Card
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:shadow-md transition"
                >
                  <CardContent className="p-4 flex gap-4 items-start">
                    <SquareUser className="h-6 w-6 text-stone-400 mt-1" />
                    <div>
                      <p className="font-medium">Lihat Profil</p>
                      <p className="text-sm text-muted-foreground">
                        Pergi ke profil mu
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  onClick={() => navigate("/upload")}
                  className="cursor-pointer hover:shadow-md transition"
                >
                  <CardContent className="p-4 flex gap-4 items-start">
                    <Upload className="h-6 w-6 text-sky-500 mt-1" />
                    <div>
                      <p className="font-medium">Upload Dokumen</p>
                      <p className="text-sm text-muted-foreground">
                        Tambah dokumen baru ke sistem
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  onClick={() => navigate("/inbox")}
                  className="cursor-pointer hover:shadow-md transition"
                >
                  <CardContent className="p-4 flex gap-4 items-start">
                    <Inbox className="h-6 w-6 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">Buka Inbox</p>
                      <p className="text-sm text-muted-foreground">
                        Lihat dokumen menunggu tanda tanganmu
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  onClick={() => navigate("/send")}
                  className="cursor-pointer hover:shadow-md transition"
                >
                  <CardContent className="p-4 flex gap-4 items-start">
                    <Send className="h-6 w-6 text-emerald-500 mt-1" />
                    <div>
                      <p className="font-medium">Dokumen Pending</p>
                      <p className="text-sm text-muted-foreground">
                        Dokumen terkirim namun belum complete
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
