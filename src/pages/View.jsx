import { Document, Page } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { MoveLeft } from "lucide-react";

const STATUS_BADGE = {
  saved: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border border-gray-300",
  },
  sent: {
    label: "Menunggu Tanda Tangan",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  },
  complete: {
    label: "Selesai",
    className: "bg-green-100 text-green-800 border border-green-300",
  },
};

export default function View() {
  const [blobUrl, setblobUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [data, setData] = useState([]);
  const [doc, setDoc] = useState({});
  const [current, setCurrent] = useState("");
  const [signingMode, setSigningMode] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  let { id, title, signing } = location.state || {};

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
      navigate("/view", { state: { id: id, title: title, signing: false } });
      // navigate("/completed");
    } catch (err) {
      alert(`Tanda tangan dokumen GAGAL! ${err.response?.data?.message}`);
    }
  };

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
            responseType: "blob",
          },
        );
        if ("x-meta-info" in response.headers) {
          if (isMounted) {
            const meta = JSON.parse(response.headers.get("X-Meta-Info"));
            setCurrent(meta.current);
            setSigningMode(meta.signingMode);
            setData(meta.receiver);
            setDoc(meta.doc);
          }
          setblobUrl(URL.createObjectURL(response.data));
        }
      } catch (err) {
        // TODO: since we tell axios to always treat all response as blob, if server response an json error, we have to parse it first
        if (isMounted) {
          let errorMessage = "Gagal dalam memuat dokumen.";

          if (
            err.response?.data instanceof Blob &&
            err.response?.data?.type === "application/json"
          ) {
            try {
              const text = await err.response.data.text();
              const json = JSON.parse(text);
              errorMessage += ` ${json.message ?? ""}`;
            } catch (e) {
              // fallback if blob is not JSON
              errorMessage += " Unable to parse error response.";
            }
          } else {
            errorMessage += ` ${err.response?.data?.message ?? ""}`;
          }

          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, [id, signing]);

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
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">
                  {signing ? "Tanda Tangan" : "Lihat"} Dokumen
                </h2>

                {STATUS_BADGE[doc.status] && (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[doc.status].className}`}
                  >
                    {STATUS_BADGE[doc.status].label}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground truncate max-w-[60ch]">
                {title}
              </p>
            </div>

            {signing && (
              <button
                onClick={() => signDocument(id)}
                className="
                  inline-flex items-center gap-2
                  rounded-lg px-4 py-2
                  bg-blue-600 text-white
                  shadow-md shadow-blue-600/30
                  hover:bg-blue-500
                  active:scale-[0.98]
                  transition
                "
              >
                ✍️ Tanda Tangan
              </button>
            )}
          </div>

          <div className="inline-block mr-16 opacity-0">
            foo bar buz .........
          </div>
          <div className="relative border inline-block">
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
                <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    pageNumber={pageNumber}
                    onRenderSuccess={onPageRenderSuccess}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              </div>
            </div>

            {data &&
              Object.keys(data).length !== 0 &&
              data.pointer.page === pageNumber &&
              data.user === localStorage.getItem("id") &&
              (signingMode === "sequential" ? data.urutan === current : true) &&
              !data.signed && (
                <div
                  key={data.user._id}
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
                    left: `${(data.pointer.x / pageDims.width) * 100}%`,
                    top: `${((pageDims.height - data.pointer.y) / pageDims.height) * 100}%`,
                    width: `${(data.pointer.width / pageDims.width) * 100}%`,
                    height: `${(data.pointer.height / pageDims.height) * 100}%`,
                    position: "absolute",
                  }}
                >
                  ✍️
                  <span>TTD di sini</span>
                </div>
              )}
          </div>

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
        </div>
      </div>
    </main>
  );
}
