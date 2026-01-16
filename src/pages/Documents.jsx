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

// import { DatePicker } from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import useAudit from "../hooks/useAudit.jsx";
import AuditModal from "../components/audit-modal.jsx";

const types = {
  ADD: "ADDENDUM",
  BA: "BERITA ACARA",
  SKU: "SURAT KUASA",
  JO: "JOB ORDER",
  KK: "KONTRAK KERJA",
  KW: "KWITANSI",
  MOM: "MINUTES OF MEETING",
  MOU: "MEMORANDUM OF UNDERSTANDING",
  NC: "NOTA CAPAIAN",
  ND: "NOTA DINAS",
  PENG: "PENGADUAN",
  PEM: "PEMBERITAHUAN",
  PB: "PENERIMAAN BARANG",
  PM: "PERMOHONAN",
  PN: "PENOLAKAN",
  NDA: "PERJANJIAN KERAHASIAAN",
  PKS: "PERJANJIAN KERJA SAMA",
  PR: "PERKENALAN",
  PNW: "PENERANGAN",
  PO: "PURCHASE ORDER",
  PT: "PENGANTAR",
  SK: "SURAT KEPUTUSAN",
  SKT: "SURAT KETERANGAN",
  SP: "SURAT PERINGATAN",
  SPI: "SURAT PEMBERIAN IZIN",
  SPK: "SURAT PERINTAH KERJA",
  SPR: "SURAT PERNYATAAN",
  SR: "SURAT REKOMENDASI",
  SE: "SURAT EDARAN",
  PNG: "PENUGASAN",
  SERT: "SERTIFIKAT",
  TAG: "TAGIHAN",
  U: "UNDANGAN",
  ST: "SURAT TEGURAN",
  PQ: "MATERIAL REQUEST",
  PJ: "PERSETUJUAN",
  CL: "CONFIRMATION LETTER",
};

const divisions = {
  MKT: "MARKETING & SALES",
  FIN: "FINANCE",
  CHC: "CORP & HUMAN CAPITAL",
  PROD: "PRODUCT & ENGINEERING",
  OPS: "OPERATION",
  ITINFRA: "IT INFRA & SECURITY",
  LGL: "LEGAL",
  DIR: "DIREKSI",
  ADMIN: "ADMIN",
};

const statuses = ["saved", "sent", "complete"];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { audit, auditDoc, isModalOpen, setIsModalOpen } = useAudit();

  const [selectedDiv, setSelectedDiv] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStat, setSelectedStat] = useState([]);
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

  const handleSelectStat = (key) => {
    if (!selectedStat.includes(key)) {
      setSelectedStat([key, ...selectedStat]);
    } else {
      setSelectedStat(selectedStat.filter((v) => v !== key));
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

    if (selectedStat.length > 0) {
      qParam += "&status=";
      selectedStat.forEach((el, i) => {
        qParam += el + ",";
      });
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/?${qParam}`,
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
        `${process.env.REACT_APP_BASE_URL}/documents/`,
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
        `Terjadi kesalahan dalam menghapus dokumen. ${err.response?.data?.message}`,
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
          <h1 className="text-3xl font-bold tracking-tight">Semua Dokumen</h1>
          <p className="text-muted-foreground">
            Daftar semua dokumen yang ada di DMS ini dari semua user.
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={
                selectedDiv.length > 0 ||
                selectedTypes.length > 0 ||
                selectedStat.length > 0
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

        <span className="text-muted-foreground -mb-5 pl-1">
          Jumlah: {filteredDocuments.length}
        </span>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nomor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tanggal Upload</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
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
                  <TableCell>{document.createdAt}</TableCell>
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

      {isFilterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="p-6 bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Filter Dokumen</h2>

            <div className="grid grid-cols-3">
              <h4 className="font-semibold mb-2">Tipe Dokumen</h4>
              <p></p>
              <p></p>
              {Object.keys(types).map((key) => (
                <div key={key}>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="hidden peer"
                      selected={selectedTypes.includes(key)}
                      checked={selectedTypes.includes(key)}
                      onChange={() => handleSelectType(key)}
                    />
                    <div class="w-5 h-5 border-2 border-gray-400 rounded peer-checked:bg-primary peer-checked:border-primary"></div>
                    <span class="text-gray-700">{key}</span>
                  </label>
                </div>
              ))}
              <p></p>
              <p></p>

              <h4 className="font-semibold mb-2 mt-4">Divisi</h4>
              <p></p>
              <p></p>
              {Object.keys(divisions).map((key) => (
                <div key={key}>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="hidden peer"
                      selected={selectedDiv.includes(key)}
                      checked={selectedDiv.includes(key)}
                      onChange={() => handleSelectDiv(key)}
                    />
                    <div class="w-5 h-5 border-2 border-gray-400 rounded peer-checked:bg-primary peer-checked:border-primary"></div>
                    <span class="text-gray-700">{key}</span>
                  </label>
                </div>
              ))}

              <h4 className="font-semibold mb-2 mt-4">Status</h4>
              <p></p>
              <p></p>
              {statuses.map((key) => (
                <div key={key}>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="hidden peer"
                      selected={selectedStat.includes(key)}
                      checked={selectedStat.includes(key)}
                      onChange={() => handleSelectStat(key)}
                    />
                    <div class="w-5 h-5 border-2 border-gray-400 rounded peer-checked:bg-primary peer-checked:border-primary"></div>
                    <span class="text-gray-700">{key}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* TODO: date range is not implemented yet because it will get complexs, date range in draft or in completed will be different kind of date*/}
            {/* <h4 className="font-semibold mb-2 mt-4">Tanggal</h4>
            <div className="grid grid-cols-2 gap-x-2">
              <div>
                <p className="text-sm text-gray-600">Tanggal Mulai</p>
                <DatePicker
                  mode="single"
                  selected={selectedStartDate}
                  onSelect={setSelectedStartDate}
                  placeHolder="Masukan Tanggal Mulai"
                  className="rounded-md border bg-inherit p-1 w-full"
                  classNames={{
                    day_selected: "bg-blue-600 text-white",
                    day_today: "text-blue-600 font-bold",
                    day: "hover:bg-blue-100 rounded",
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Akhir</p>
                <DatePicker
                  mode="single"
                  selected={selectedEndDate}
                  onSelect={setSelectedEndDate}
                  placeHolder="Masukan Tanggal Akhir"
                  className="rounded-md border bg-inherit p-1 w-full"
                  classNames={{
                    day_selected: "bg-blue-600 text-white",
                    day_today: "text-blue-600 font-bold",
                    day: "hover:bg-blue-100 rounded",
                  }}
                />
              </div>
            </div>*/}

            <div className="flex justify-end gap-2 pt-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" onClick={handleFilter}>
                Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
