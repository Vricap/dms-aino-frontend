import { Document, Page } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function View() {
  const [blobUrl, setblobUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState("");
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
      alert(`Tanda tangan dokumen GAGAL! ${err.response.data.message}`);
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
            setData(meta.receiver);
          }
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

    return () => {
      isMounted = false;
    };
  }, [id, signing]);

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

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">
            {signing ? "Tanda Tangan" : "Lihat"} Dokumen
          </h2>
          <p className="text-muted-foreground">
            <em>{title}</em>
          </p>

          <div className="flex gap-6 justify-end">
            {signing && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => signDocument(id)}
              >
                Tanda Tangan
              </button>
            )}
          </div>

          <div className="inline-block mr-16 opacity-0">
            foo bar buz .........
          </div>
          <div className="relative border inline-block">
            <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                onRenderSuccess={onPageRenderSuccess}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>

            {data &&
              Object.keys(data).length !== 0 &&
              data.pointer.page === pageNumber &&
              data.user === localStorage.getItem("id") &&
              data.urutan === current &&
              !data.signed && (
                <div
                  key={data.user._id}
                  className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-25 text-blue-700 flex justify-center items-center"
                  style={{
                    left: `${(data.pointer.x / pageDims.width) * 100}%`,
                    top: `${((pageDims.height - data.pointer.y) / pageDims.height) * 100}%`,
                    width: `${(data.pointer.width / pageDims.width) * 100}%`,
                    height: `${(data.pointer.height / pageDims.height) * 100}%`,
                    position: "absolute",
                  }}
                >
                  TTD Disini
                </div>
              )}
          </div>

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
                Halaman {pageNumber} / {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((p) => p + 1)}
              >
                ➡️
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
