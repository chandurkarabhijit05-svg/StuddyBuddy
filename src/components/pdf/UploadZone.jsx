import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, XCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function UploadZone({ file, onFileSelect, onClear }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      onFileSelect(droppedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {!file ? (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${
            isDragOver
              ? "border-violet-500/50 bg-violet-500/5"
              : "border-slate-700/50 bg-slate-800/20 hover:border-slate-600/50"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) onFileSelect(selected);
            }}
            className="hidden"
          />
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl" />
            <div className="relative p-5 bg-slate-800/50 border border-slate-700/30 rounded-2xl">
              <Upload className="w-8 h-8 text-violet-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Drop your PDF here
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            or click to browse from your computer
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-xs text-slate-400">
            <FileText className="w-3.5 h-3.5" />
            Supports PDF files up to 50MB
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm"
        >
          <div className="p-3 bg-emerald-500/15 rounded-xl">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-300 truncate">
              {file.name}
            </p>
            <p className="text-xs text-emerald-400/60 mt-0.5">
              {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <XCircle className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}