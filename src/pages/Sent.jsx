import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { MoveLeft } from "lucide-react";

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
  const signCounterRef = useRef(1); // use ref so that the value persist at every render
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [signingMode, setSigningMode] = useState("sequential");

  const containerRef = useRef();
  const location = useLocation();
  const { id, title } = location.state || {};

  const options = users?.rows.map((user) => ({
    label: `${user.username} (${user.email}, ${user.division})`,
    value: user._id,
  }));

  function screenToPdf(clientX, clientY) {
    const bounds = containerRef.current.getBoundingClientRect();

    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    const scaleX = pageDims.width / bounds.width;
    const scaleY = pageDims.height / bounds.height;

    return {
      x: x * scaleX,
      y: (bounds.height - y) * scaleY, // bottom-left origin
    };
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (draggingIndex === null) return;

      const { x, y } = screenToPdf(e.clientX, e.clientY);

      setPointerPos((prev) => {
        const updated = [...prev];
        updated[draggingIndex] = {
          ...updated[draggingIndex],
          x,
          y,
        };
        return updated;
      });
    }

    function handleMouseUp() {
      setDraggingIndex(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIndex, pageDims]);

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
    <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <span className="animate-spin text-2xl">📄</span>
        <span>Memuat dokumen...</span>
      </div>
    </div>;
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
          signingMode,
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
      <div
        className="flex items-center cursor-pointer mb-4"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="text-muted-foreground italic" />
        <span className="text-muted-foreground italic">Kembali</span>
      </div>
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
              <div className="flex justify-center">
                <div
                  className="
                    relative
                    bg-white
                    rounded-xl
                    shadow-xl shadow-black/20
                    border
                    overflow-hidden
                  "
                >
                  <Document
                    file={blobUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page
                      pageNumber={pageNumber}
                      onRenderSuccess={onPageRenderSuccess}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </Document>
                </div>
              </div>

              {/* TODO: pointerPos is now an array and EMPTY array is TRUTHY*/}
              {pointerPos.map((pos, index) =>
                pos.page === pageNumber ? (
                  <div
                    key={index}
                    onMouseDown={() => setDraggingIndex(index)}
                    className="
                        absolute
                        border-2 border-dashed border-blue-500
                        bg-blue-500/10
                        rounded-lg
                        flex flex-col items-center justify-center
                        text-blue-600
                        font-semibold
                        text-sm
                        animate-pulse
                        cursor-pointer
                      "
                    style={{
                      left: `${(pos.x / pageDims.width) * 100}%`,
                      top: `${((pageDims.height - pos.y) / pageDims.height) * 100}%`,
                      width: `${(pos.width / pageDims.width) * 100}%`,
                      height: `${(pos.height / pageDims.height) * 100}%`,
                    }}
                  >
                    ✍️
                    <span>TTD di sini {pos.number}</span>
                  </div>
                ) : null,
              )}
            </div>
          )}

          <div className="flex justify-between">
            <div></div>
            <div
              className="
                absolute bottom-4 left-1/2 -translate-x-1/2
                flex items-center gap-4
                rounded-full
                bg-black/70 backdrop-blur
                px-4 py-2
                text-white text-sm
                shadow-lg
              "
              draggable="true"
            >
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="disabled:opacity-40 hover:text-blue-300 transition"
              >
                ⬅️
              </button>

              <span>
                {pageNumber} / {numPages}
              </span>

              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="disabled:opacity-40 hover:text-blue-300 transition"
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
            <div className="space-y-2">
              <label className="font-medium">Mode Tanda Tangan:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="sequential"
                    checked={signingMode === "sequential"}
                    onChange={() => {
                      setSigningMode("sequential");
                      // setSelectedUser([]);
                    }}
                  />
                  Berurutan
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="parallel"
                    checked={signingMode === "parallel"}
                    onChange={() => {
                      setSigningMode("parallel");
                      // setSelectedUser([[]]); // only one step
                    }}
                  />
                  Paralel
                </label>
              </div>
            </div>

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
