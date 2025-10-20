import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Sent() {
  const [blobUrl, setblobUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [pointerPos, setPointerPos] = useState([]);
  const [users, setUsers] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  const containerRef = useRef();
  const location = useLocation();
  const { id, title } = location.state || {};

  useEffect(() => {
    let isMounted = true;

    const fetchDocuments = async () => {
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
        if (isMounted) {
          setblobUrl(URL.createObjectURL(response.data));
        }
      } catch (err) {
        // TODO: since we tell axios to always treat all response as blob, if server response an json error, we cant read the error message
        if (isMounted) {
          setError(`Failed to load documents. ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDocuments();

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`,
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          },
        );
        setUsers(response.data);
      } catch (err) {
        setError(`Error getting all user. ${err.response?.data?.message}`);
      }
    };
    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <p className="p-4">Loading documents...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onPageRenderSuccess(page) {
    const viewport = page.getViewport({ scale: 1 });
    setPageDims({ width: viewport.width, height: viewport.height });
  }

  function handleDrop(e) {
    e.preventDefault();
    const bounds = containerRef.current.getBoundingClientRect();
    const dropX = e.clientX - bounds.left;
    const dropY = e.clientY - bounds.top;

    const scaleX = pageDims.width / bounds.width;
    const scaleY = pageDims.height / bounds.height;

    const pdfX = dropX * scaleX;
    const pdfY = (bounds.height - dropY) * scaleY; // bottom-left origin

    const width = 120;
    const height = 50;

    const pos = {
      page: pageNumber,
      x: pdfX,
      y: pdfY,
      width,
      height,
    };

    setPointerPos([...pointerPos, pos]);
    // onSave(pos); // send to backend or store in parent
  }

  const sentRequest = async () => {
    if (!pointerPos || !selectedUser) {
      setError(
        "Letakkan tempat tanda tangan dan pilih penerima sebelum mengirim.",
      );
      return;
    }

    const dateSent = new Date();
    const receiver = { user: selectedUser, dateSent };

    try {
      await axios.put(
        process.env.REACT_APP_BASE_URL + `/documents/${id}`,
        {
          status: "sent",
          receiver: receiver,
          pointer: pointerPos,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      navigate("/draft");
    } catch (err) {
      setError(`Gagal mengirim file: ${err.response?.data?.message}`);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Tempatkan Letak Tanda Tangan</h2>
          <p className="text-muted-foreground">
            <em>{title}</em>
          </p>

          <div className="flex gap-6 justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Pilih Penerima
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={sentRequest}
            >
              Kirim
            </button>
          </div>

          <div className="inline-block mr-16 opacity-0">
            foo bar buz .........
          </div>
          {blobUrl && (
            <div
              ref={containerRef}
              className="relative border inline-block"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{ minHeight: 400 }}
            >
              <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={pageNumber}
                  onRenderSuccess={onPageRenderSuccess}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>

              {pointerPos &&
                pointerPos.map((pos, index) =>
                  pos.page === pageNumber ? (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-25 text-blue-700 flex justify-center items-center"
                      style={{
                        left: `${(pos.x / pageDims.width) * 100}%`,
                        top: `${((pageDims.height - pos.y) / pageDims.height) * 100}%`,
                        width: `${(pos.width / pageDims.width) * 100}%`,
                        height: `${(pos.height / pageDims.height) * 100}%`,
                        position: "absolute",
                      }}
                    >
                      TTD Disini
                    </div>
                  ) : null,
                )}
            </div>
          )}

          <div className="flex justify-between">
            <div></div>
            <div className="flex space-x-2 p-2">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
              >
                ⬅️
              </button>
              <span>
                Page {pageNumber} / {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((p) => p + 1)}
              >
                ➡️
              </button>
            </div>

            <div
              className="bg-blue-600 text-white cursor-grab rounded p-2"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", "signature-pointer")
              }
            >
              🖋️ Drag ke PDF
            </div>
          </div>
        </div>
      </div>

      {/* popup for selecting users */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Select Users</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {users &&
                users.rows.map((user) => (
                  <label key={user._id} className="block">
                    <input
                      type="radio"
                      className="mr-2"
                      checked={selectedUser.includes(user._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUser(user._id);
                        }
                        // else {
                        //   setSelectedUser((prev) =>
                        //     prev.filter((id) => id !== user._id),
                        //   );
                        // }
                      }}
                    />
                    {user.username || user.email}
                  </label>
                ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  // console.log("Selected users:", selectedUsers);
                }}
                className="px-3 py-1 bg-blue-600 rounded text-white"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
