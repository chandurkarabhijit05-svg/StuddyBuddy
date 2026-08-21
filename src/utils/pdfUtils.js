import * as pdfjsLib from "pdfjs-dist";
import { toast } from "react-toastify";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Extract REAL text from PDF using pdfjs-dist
export async function extractPdfText(pdfFile) {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + " ";
    }

    if (!fullText.trim()) {
      throw new Error("No text found in PDF");
    }

    return fullText.trim().slice(0, 8000);
  } catch (err) {
    console.error("PDF parse error:", err);
    toast.error("Could not read PDF text. Using filename as fallback.");
    return `Document: ${pdfFile.name}. This is a PDF document uploaded for analysis.`;
  }
}