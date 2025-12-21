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
import {
  FileText,
  // FileSignature,
  MoreHorizontal,
  Download,
  Share,
  Trash,
  Search,
  // Plus,
  Filter,
  Eye,
  History,
} from "lucide-react";
import useAudit from "../hooks/useAudit.jsx";
import AuditModal from "../components/audit-modal.jsx";
import FilterModal from "../components/filter-modal.jsx";

export default function Documents() {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { audit, auditDoc, isModalOpen, setIsModalOpen } = useAudit();

  const [selectedDiv, setSelectedDiv] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  // const [selectedStartDate, setSelectedStartDate] = useState(null);
  // const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        qParam += el;
        if (!i + 1 === selectedDiv.length) {
          qParam += ",";
        }
      });
    }

    if (selectedTypes.length > 0) {
      qParam += "&typ=";
      selectedTypes.forEach((el, i) => {
        qParam += el;
        if (!i + 1 === selectedTypes.length) {
          qParam += ",";
        }
      });
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/?status=sent${qParam}`,
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
        `${process.env.REACT_APP_BASE_URL}/documents/?status=sent`,
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

  const handleSent = (id, title) => {
    navigate("/sent", { state: { id: id, title: title } });
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
          <h1 className="text-3xl font-bold tracking-tight">Sent</h1>
          <p className="text-muted-foreground">Dokumen yang kamu kirim. </p>
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nomor</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kepada</TableHead>
                <TableHead>Tanggal Kirim</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{document.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{document.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{document.division}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>
                    {document.receiver.data.map(
                      (data) => data.user.username + ", ",
                    )}
                  </TableCell>
                  <TableCell>{document.receiver.data[0].dateSent}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {document.status !== "sent" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleSent(document._id, document.title)
                            }
                          >
                            <Share className="mr-2 h-4 w-4" />
                            <span>Kirim</span>
                          </DropdownMenuItem>
                        )}
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
      </div>
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
    </main>
  );
}
