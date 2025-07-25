import { useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function Sent() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [pointerPos, setPointerPos] = useState(null);

  const containerRef = useRef();

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

    setPointerPos(pos);
    // onSave(pos); // send to backend or store in parent
  }
  const location = useLocation();
  const { id, title } = location.state || {};

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Place Signature Pointer</h2>

          <div
            className="mb-2 inline-block px-3 py-1 bg-blue-600 text-white cursor-grab rounded"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", "signature-pointer")
            }
          >
            🖋️ Drag me to PDF
          </div>

          <div
            ref={containerRef}
            className="relative border inline-block"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{ minHeight: 400 }}
          >
            <Document file="/sample.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                onRenderSuccess={onPageRenderSuccess}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>

            {pointerPos && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-25 text-blue-700 flex justify-center items-center"
                style={{
                  left: `${(pointerPos.x / pageDims.width) * 100}%`,
                  top: `${((pageDims.height - pointerPos.y) / pageDims.height) * 100}%`,
                  width: `${(pointerPos.width / pageDims.width) * 100}%`,
                  height: `${(pointerPos.height / pageDims.height) * 100}%`,
                  position: "absolute",
                }}
              >
                SIGN HERE
              </div>
            )}
          </div>

          <div className="mt-2 flex space-x-2">
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
    </main>
  );
}
export default Sent;
