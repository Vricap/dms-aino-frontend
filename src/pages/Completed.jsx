import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import {
  FileText,
  MoreHorizontal,
  Download,
  Trash,
  Search,
  Filter,
  Eye,
  History,
} from "lucide-react";
import useAudit from "../hooks/useAudit.jsx";
import AuditModal from "../components/audit-modal.jsx";

export default function Documents() {
  const [documents, setDocuments] = useState(null);
  const [documentsSigned, setDocumentsSigned] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { audit, auditDoc, isModalOpen, setIsModalOpen } = useAudit();

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/?status=complete`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      setDocuments(response.data);

      const r = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/signed`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      setDocumentsSigned(r.data);
    } catch (err) {
      setError(`Gagal dalam load dokumen. ${err.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const viewDoc = async (id, title) => {
    try {
      await axios.put(
        process.env.REACT_APP_BASE_URL + `/documents/logs/${id}/?activity=view`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
    } catch (err) {
    } finally {
      navigate("/view", { state: { id: id, title: title } });
    }
  };

  const downloadDoc = async (id, title) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/blob/${id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
          responseType: "blob", // Tell axios to treat the response as a Blob
        },
      );
      const fileURL = window.URL.createObjectURL(response.data);
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = title;
      alink.click();

      await axios.put(
        process.env.REACT_APP_BASE_URL +
          `/documents/logs/${id}/?activity=download`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
    } catch (err) {
      alert(`Gagal dalam download dokumen. ${err.response?.data?.message}`);
    }
  };

  const deleteDoc = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/documents/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      alert("Dokumen berhasil di hapus!");
      await fetchDocuments();
    } catch (err) {
      alert(
        `Terhadi kesalahan dalam menghapus dokumen. ${err.response?.data?.message}`,
      );
      await fetchDocuments();
    }
  };

  useEffect(() => {
    fetchDocuments();
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
          <h1 className="text-3xl font-bold tracking-tight">Completed</h1>
          <p className="text-muted-foreground">
            Dokumen yang <strong>kamu upload</strong> dan sudah di tanda tangani
            oleh semua penerima.{" "}
            {localStorage.getItem("role") === "admin"
              ? "Role kamu adalah Admin. Kamu dapat melihat semua dokumen yang 'complete' dari semua user."
              : ""}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex w-full md:w-1/2 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari dokumen..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nomor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tanggal Complete</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.rows.map((document) => (
                <TableRow key={document._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{document.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{document.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        document.status === "saved"
                          ? "success"
                          : document.status === "sent"
                            ? "warning"
                            : document.status === "completed"
                              ? "outline"
                              : "secondary"
                      }
                      className={
                        document.status === "saved"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600"
                          : document.status === "sent"
                            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-600"
                            : document.status === "completed"
                              ? "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 hover:text-gray-600"
                              : ""
                      }
                    >
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{document.division}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.dateComplete}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => viewDoc(document._id, document.title)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Lihat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            downloadDoc(document._id, document.title)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => auditDoc(document._id)}
                        >
                          <History className="mr-2 h-4 w-4" />
                          <span>Audit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteDoc(document._id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-muted-foreground">
          Seluruh dokumen yang <strong>pernah</strong> kamu tanda tangani,{" "}
          <strong>
            <em>dari kamu maupun orang lain</em>
          </strong>
          :
        </p>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nomor</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tanggal Tanda Tangan</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsSigned.map((document) => (
                <TableRow key={document._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{document.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{document.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{document.division}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.dateSigned}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => viewDoc(document._id, document.title)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Lihat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            downloadDoc(document._id, document.title)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
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
      <AuditModal
        audit={audit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
