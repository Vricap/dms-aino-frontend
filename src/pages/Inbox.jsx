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
// import { Badge } from "../components/ui/badge";
import {
  FileText,
  MoreHorizontal,
  Download,
  Trash,
  Search,
  Filter,
  Eye,
} from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const viewDoc = (id, title) => {
    navigate("/view", { state: { id: id, title: title } });
  };

  const signDocument = async (id) => {
    try {
      await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/sign/${id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      alert(`Tanda tangan dokumen BERHASIL!`);
      navigate("/inbox");
    } catch (err) {
      alert(`Tanda tangan dokumen GAGAL! ${err.response.data.message}`);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/documents/inbox`,
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          },
        );
        setDocuments(response.data);
      } catch (err) {
        setError(
          `Failed to load documents. You may not be logged in. ${err.response.data.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

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
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Dokumen yang dikirim kepadamu.
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead className="w-[70px]"></TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.rows.map((document) => (
                <TableRow key={document._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{document.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{document.division}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  {document.receiver.map((v) => (
                    <TableCell>{v.dateSent}</TableCell>
                  ))}
                  <TableCell>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => signDocument(document._id)}
                    >
                      SIGN
                    </button>
                  </TableCell>
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
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
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
