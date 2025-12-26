import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
  const [selectedUser, setSelectedUser] = useState({});
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  // let signCounterRef = 1;
  const signCounterRef = useRef(1); // use ref so that the value persist at every render

  const containerRef = useRef();
  const location = useLocation();
  const { id, title } = location.state || {};

  const options = users?.rows.map((user) => ({
    label: `${user.username} (${user.email}, ${user.division})`,
    value: user._id,
  }));

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
          setError(`Gagal dalam load dokumen. ${err.message}`);
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
        setError(
          `Error dalam mendapatkan semua user. ${err.response?.data?.message}`,
        );
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

  function clearSign() {
    setCount(0);
    setPointerPos([]);
    setSelectedUser({});
    signCounterRef.current = 1;
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

    setCount(count + 1);

    const pos = {
      page: pageNumber,
      x: pdfX,
      y: pdfY,
      width,
      height,
      count,
      number: signCounterRef.current++,
    };
    setPointerPos([...pointerPos, pos]);
    // onSave(pos); // send to backend or store in parent
  }

  const sentRequest = async () => {
    for (const key in selectedUser) {
      if (selectedUser[key].length < 1) {
        alert(`Urutan nomor ${key * 1 + 1} belum ada penerima!`);
        return;
      }
    }

    if (pointerPos.length === 0 || Object.keys(selectedUser).length < 1) {
      alert(
        "Letakkan tempat tanda tangan dan pilih penerima sebelum mengirim.",
      );
      return;
    }

    if (Object.keys(selectedUser).length !== count) {
      alert(
        `Tidak cocok! Jumlah penerima: ${Object.keys(selectedUser).length}. Jumlah ttd: ${count}`,
      );
      return;
    }

    const dateSent = new Date();
    const data = [];

    for (const key in selectedUser) {
      const pos = pointerPos.filter((obj) => obj.count === key * 1); // i think its impossilbe an error will happen here. it will always match

      for (const user of selectedUser[key]) {
        data.push({
          urutan: key * 1 + 1,
          user: user,
          dateSent,
          pointer: pos[0],
        });
      }
    }

    try {
      await axios.put(
        process.env.REACT_APP_BASE_URL + `/documents/${id}`,
        {
          data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      navigate("/send");
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
            {count > 0 && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Pilih Penerima
              </button>
            )}

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

              {/* TODO: pointerPos is now an array and EMPTY array is TRUTHY*/}
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
                      TTD Disini {pos.number}
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
                onClick={() => {
                  return setPageNumber((p) => p - 1);
                }}
              >
                ⬅️
              </button>
              <span>
                Halaman {pageNumber} / {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => {
                  return setPageNumber((p) => p + 1);
                }}
              >
                ➡️
              </button>
            </div>

            <div className="flex gap-1">
              {/* TODO: pointerPos is now an array and EMPTY array is TRUTHY*/}
              {pointerPos && (
                <div
                  className="bg-red-600 text-white cursor-grab rounded p-2"
                  onClick={clearSign}
                >
                  🧹 Clear
                </div>
              )}
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
      </div>

      {/* popup for selecting users */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold">
              Pilih Penerima dan Tentukan Urutan
            </h3>
            <span>Jumlah tanda tangan: {count}</span>

            <div className="max-h-[80vh] min-h-[30vh] overflow-y-auto space-y-2">
              {count &&
                [...Array(count)].map((val, i) => (
                  <div className="mb-4" key={i}>
                    <label className="mb-1 font-medium">
                      Pilih urutan ke {i + 1}:
                    </label>
                    <Select
                      isMulti
                      options={options}
                      value={options.filter((el) =>
                        selectedUser[i]?.includes(el.value),
                      )}
                      onChange={(selected) => {
                        const deepCopy = structuredClone(selectedUser);
                        deepCopy[i] = selected.map((el) => el.value);
                        setSelectedUser(deepCopy);
                      }}
                    />

                    {/* <select
                      multiple
                      size={5}
                      onChange={(e) => (selectedUser[i] = e.target.value)}
                      defaultValue={selectedUser[i]}
                      required
                      className="w-full rounded px-3 py-2 mb-2"
                    >
                      <option value="">Pilih Penerima</option>
                      {users &&
                        users.rows.map((user) => (
                          <option key={user._id} value={user._id}>
                            {`${user.username} (${user.email}, ${user.division})`}
                          </option>
                        ))}
                    </select>*/}
                  </div>
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
                onClick={() => setIsModalOpen(false)}
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
