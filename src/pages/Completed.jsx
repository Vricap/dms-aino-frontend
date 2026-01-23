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
import FilterModal from "../components/filter-modal.jsx";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { audit, auditDoc, isModalOpen, setIsModalOpen } = useAudit();

  const [selectedDiv, setSelectedDiv] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  // const [selectedStartDate, setSelectedStartDate] = useState(null);
  // const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    return (
      doc.deskripsi?.toLowerCase().includes(query) ||
      doc.content?.toLowerCase().includes(query) ||
      doc.title?.toLowerCase().includes(query)
    );
  });

  const handleSelectType = (key) => {
    if (!selectedTypes.includes(key)) {
      setSelectedTypes([key, ...selectedTypes]);
    } else {
      setSelectedTypes(selectedTypes.filter((v) => v !== key));
    }
  };

  const handleSelectDiv = (key) => {
    if (!selectedDiv.includes(key)) {
      setSelectedDiv([key, ...selectedDiv]);
    } else {
      setSelectedDiv(selectedDiv.filter((v) => v !== key));
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    let qParam = "";
    if (selectedDiv.length > 0) {
      qParam += "&div=";
      selectedDiv.forEach((el, i) => {
        qParam += el + ",";
      });
    }

    if (selectedTypes.length > 0) {
      qParam += "&typ=";
      selectedTypes.forEach((el, i) => {
        qParam += el + ",";
      });
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/?status=complete${qParam}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );

      setDocuments(response.data.rows);
    } catch (err) {
      setError(`Gagal dalam load dokumen. ${err.response?.data?.message}`);
    } finally {
      setLoading(false);
      setIsFilterModalOpen(false);
    }
  };

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
      setDocuments(response.data.rows);
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
    const confirmed = window.confirm(
      "Yakin ingin menghapus dokumen ini?\nDokumen tidak akan bisa diakses kembali.",
    );
    if (!confirmed) return;

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
    return (
      <main className="container mx-auto py-6 px-4 md:px-6 min-h-screen">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>

          {/* Search bar */}
          <div className="flex gap-3 max-w-lg">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          </div>

          {/* Table skeleton */}
          <div className="rounded-md border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-7 gap-4 px-4 py-3 border-b bg-muted/30">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 min-h-screen">
      <div className="rounded-2xl bg-background shadow-sm border p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Completed</h1>
            <p className="text-muted-foreground">
              Dokumen yang <strong>kamu upload</strong> dan sudah di tanda
              tangani oleh semua penerima.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/40 rounded-xl p-3 border">
            <div className="flex w-full md:w-1/2 items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari dokumen..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant={
                  selectedDiv.length > 0 || selectedTypes.length > 0
                    ? ""
                    : "outline"
                }
                size="icon"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            {(selectedDiv.length > 0 || selectedTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 text-sm">
                {selectedDiv.map((div) => (
                  <Badge key={div} variant="secondary">
                    {div}
                  </Badge>
                ))}
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <span className="text-muted-foreground -mb-5 pl-1">
            Jumlah: {filteredDocuments.length}
          </span>
          <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Tanggal Complete</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium leading-tight">
                            {document.content}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {document.title}
                          </span>
                        </div>
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
                            onClick={() =>
                              viewDoc(document._id, document.title)
                            }
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
                            className="text-red-600 focus:text-red-600"
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
        </div>

        {filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mb-3 opacity-50" />
            <p className="font-medium">Tidak ada dokumen</p>
            <p className="text-sm">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}

        <AuditModal
          audit={audit}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <FilterModal
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          handleFilter={handleFilter}
          selectedTypes={selectedTypes}
          selectedDiv={selectedDiv}
          handleSelectType={handleSelectType}
          handleSelectDiv={handleSelectDiv}
        />
      </div>
    </main>
  );
}
