import { toast } from "react-toastify";

export function downloadContent(content, filename) {
  if (!content) {
    toast.error(`Generate ${filename.split("-")[1]} first`);
    return;
  }
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  toast.success("Download started!");
}