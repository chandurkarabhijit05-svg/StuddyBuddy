import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  BookOpen,
  Layers,
  Eye,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// ─── Page Navigation Component ─────────────────────────────
function PageNavigation({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl">
        <span className="text-sm font-semibold text-white min-w-[20px] text-center">
          {currentPage}
        </span>
        <span className="text-slate-500 text-sm">/</span>
        <span className="text-sm text-slate-400 min-w-[20px] text-center">
          {totalPages || "?"}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── Zoom Controls ───────────────────────────────────────
function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onZoomOut}
        disabled={scale <= 0.5}
        className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 disabled:opacity-30 transition-all"
      >
        <ZoomOut className="w-4 h-4" />
      </motion.button>

      <span className="text-sm font-medium text-slate-400 w-14 text-center">
        {Math.round(scale * 100)}%
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onZoomIn}
        disabled={scale >= 3}
        className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 disabled:opacity-30 transition-all"
      >
        <ZoomIn className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── Loading State ───────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-10 h-10 text-violet-400" />
      </motion.div>
      <p className="text-sm text-slate-500 mt-4">Loading PDF...</p>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="p-4 bg-rose-500/10 rounded-2xl mb-4">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        Failed to load PDF
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        There was an error loading the document. Please check the URL and try again.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-6 py-2.5 bg-slate-800/50 border border-slate-700/30 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-500/40 transition-all flex items-center gap-2"
      >
        <RotateCw className="w-4 h-4" />
        Retry
      </motion.button>
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-xl" />
        <div className="relative p-5 bg-slate-800/50 border border-slate-700/30 rounded-3xl">
          <FileText className="w-10 h-10 text-slate-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-400 mb-2">
        No PDF Selected
      </h3>
      <p className="text-sm text-slate-600 max-w-sm">
        Upload a PDF to preview and interact with it here.
      </p>
    </motion.div>
  );
}

// ─── Main PDFPreview Component ───────────────────────────
export default function PDFPreview({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onLoadError = useCallback((err) => {
    console.error("PDF load error:", err);
    setLoading(false);
    setError(err);
  }, []);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1.2);
    setRotation(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "document.pdf";
      link.click();
    }
  };

  if (!fileUrl) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 py-8">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/20">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              PDF Preview
              {numPages && (
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  {numPages} pages
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500">
              View and navigate your document
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-blue-400 hover:border-blue-500/20 transition-all"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 transition-all"
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* PDF Viewer Container */}
      <motion.div
        layout
        className={`bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-500 ${
          isFullscreen ? "fixed inset-4 z-50" : ""
        }`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-800/50 bg-slate-900/60">
          <PageNavigation
            currentPage={currentPage}
            totalPages={numPages}
            onPageChange={handlePageChange}
          />

          <div className="flex items-center gap-3">
            <ZoomControls
              scale={scale}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRotate}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-500/40 transition-all"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="relative overflow-auto max-h-[70vh] bg-slate-950/30 p-6 flex justify-center">
          <AnimatePresence mode="wait">
            {loading && !error && <LoadingState key="loading" />}
            {error && (
              <ErrorState key="error" onRetry={() => window.location.reload()} />
            )}
            {!loading && !error && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <Document
                  file={fileUrl}
                  onLoadSuccess={onLoadSuccess}
                  onLoadError={onLoadError}
                  loading={<LoadingState />}
                  className="flex flex-col items-center"
                >
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    rotate={rotation}
                    className="shadow-2xl shadow-black/20 rounded-lg overflow-hidden"
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                  />
                </Document>

                {/* Page Thumbnails Strip */}
                {numPages > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full px-2">
                    {Array.from(new Array(Math.min(numPages, 10)), (_, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(i + 1)}
                        className={`flex-shrink-0 p-1 rounded-lg border transition-all ${
                          currentPage === i + 1
                            ? "border-violet-500/50 bg-violet-500/10"
                            : "border-slate-700/30 hover:border-slate-500/40"
                        }`}
                      >
                        <div className="w-12 h-16 bg-slate-800 rounded flex items-center justify-center">
                          <span className="text-xs text-slate-500">{i + 1}</span>
                        </div>
                      </motion.button>
                    ))}
                    {numPages > 10 && (
                      <span className="text-xs text-slate-600 px-2">
                        +{numPages - 10} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Info Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50 bg-slate-900/60 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Page {currentPage} of {numPages || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Zoom: {Math.round(scale * 100)}%</span>
            {rotation > 0 && (
              <>
                <span>•</span>
                <span>Rotated: {rotation}°</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}