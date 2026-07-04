import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFPreview({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="glass p-5 rounded-xl mt-5">
      <h2 className="text-xl font-bold mb-4">
        📄 PDF Preview
      </h2>

      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            width={600}
          />
        ))}
      </Document>
    </div>
  );
}