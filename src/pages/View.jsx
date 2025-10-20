import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function View() {
  const [blobUrl, setblobUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [pointerPos, setPointerPos] = useState([]);

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
            responseType: "blob",
          },
        );
        if (isMounted) {
          if ("x-meta-info" in response.headers) {
            const meta = JSON.parse(response.headers.get("X-Meta-Info"));
            setPointerPos(meta.message);
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

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Lihat Dokumen</h2>
          <p className="text-muted-foreground">
            <em>{title}</em>
          </p>

          <div className="flex gap-6 justify-end"></div>

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
                    TTD Disini
                  </div>
                ) : null,
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
                Page {pageNumber} / {numPages}
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
