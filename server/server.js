process.env.PDFJS_DISABLE_WORKER = "true";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PDFParser from "pdf2json";

import groq from "./groq.js";
import upload from "./upload.js";
import supabase from "./supabase.js";

import resend from "./resend.js";
import { generateEmailTemplate } from "./emailTemplate.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Study Buddy AI Backend Running");
});

// ========== PDF TEXT EXTRACTION ==========
function extractPDFText(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        let text = "";
        pdfData.Pages.forEach((page) => {
          page.Texts.forEach((item) => {
            item.R.forEach((r) => {
              text += decodeURIComponent(r.T) + " ";
            });
          });
          text += "\n";
        });
        resolve(text);
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

// ========== UPLOAD ==========
app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  try {
    const text = await extractPDFText(req.file.buffer);
    const { user_id } = req.body;

    const fileName = `${Date.now()}-${req.file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("pdfs")
      .insert([
        {
          user_id,
          file_name: req.file.originalname,
          file_url: publicUrl.publicUrl,
          summary: "",
          flashcards: null,
          quiz: null,
          score: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({ id: data.id, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== SUMMARY ==========
app.post("/api/summary", upload.single("pdf"), async (req, res) => {
  try {
    const text = await extractPDFText(req.file.buffer);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful study assistant. Summarize study material for a student.

STRICT RULES:
- Focus ONLY on the actual educational content, concepts, and ideas.
- Do NOT include file metadata (file name, size, creation date, PDF version, page count, etc.).
- Do NOT describe the document structure or layout (sections, pages, tables).
- Do NOT use horizontal rules (---).
- Do NOT use numbered sections like "1. File Metadata" or "2. Content Overview".
- Start with a 1-2 sentence overview of the main topic.
- Then list 4-8 key takeaways as bullet points.
- Bold important terms using **term**.
- Keep it concise, conversational, and focused on what a student needs to learn.
- Use simple markdown: headings, bullet points, and bold text only.`
        },
        {
          role: "user",
          content: `Summarize the following content for studying:\n\n${text.slice(0, 12000)}`
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    const summary = completion.choices[0].message.content;

    await supabase.from("pdfs").update({ summary }).eq("id", req.body.id);

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== FLASHCARDS ==========
app.post("/api/flashcards", upload.single("pdf"), async (req, res) => {
  try {
    const text = await extractPDFText(req.file.buffer);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert study assistant. Create flashcards from educational content.

STRICT RULES:
- Create 8-15 flashcards covering key concepts, definitions, and important details.
- Use this EXACT format for every card:

Card N:
Front: [question or concept]
Back: [clear answer or explanation]

- Number cards sequentially (Card 1, Card 2, etc.).
- Make questions specific and answers concise.
- Do NOT include file metadata or document structure info.
- Focus ONLY on the educational content.`
        },
        {
          role: "user",
          content: `Create flashcards from the following content. Use the exact format specified:\n\n${text.slice(0, 12000)}`
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    const flashcards = completion.choices[0].message.content;

    await supabase.from("pdfs").update({ flashcards }).eq("id", req.body.id);

    res.json({ flashcards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== QUIZ ==========
app.post("/api/quiz", upload.single("pdf"), async (req, res) => {
  try {
    const text = await extractPDFText(req.file.buffer);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert quiz generator. Create a multiple choice quiz from educational content.

STRICT RULES:
- Create 5-10 questions.
- Each question must have exactly 4 options labeled A, B, C, D.
- Use this EXACT format for every question:

Question N: [Question text]

A. [Option A]
B. [Option B]
C. [Option C]
D. [Option D]

Correct Answer: [A/B/C/D]

Explanation: [Brief explanation]

- Always include the correct answer and explanation.
- Do NOT include file metadata or document structure info.
- Focus ONLY on testing understanding of the educational content.`
        },
        {
          role: "user",
          content: `Generate a quiz from the following content. Use the exact format specified:\n\n${text.slice(0, 12000)}`
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    const quiz = completion.choices[0].message.content;

    await supabase.from("pdfs").update({ quiz }).eq("id", req.body.id);

    res.json({ quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== DASHBOARD ==========
app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("pdfs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== CHAT ==========
app.post("/api/chat", upload.single("pdf"), async (req, res) => {
  try {
    const text = await extractPDFText(req.file.buffer);

    const { question, id } = req.body;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant. Answer ONLY using the PDF content. If the answer is not in the PDF, say 'This information is not available in the PDF.'",
        },
        {
          role: "user",
          content: `
PDF Content:
${text}

Question:
${question}
`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    await supabase.from("chat_history").insert([
      {
        pdf_id: id,
        question,
        answer,
      },
    ]);

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ========== GET CHAT HISTORY ==========
app.get("/api/chat/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("pdf_id", req.params.id)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== DELETE PDF ==========
app.delete("/api/pdf/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("pdfs")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "PDF deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ========== EMAIL REPORT (ATTRACTIVE HTML) ==========
app.post("/api/send-email", async (req, res) => {
  try {
    const { email, summary, flashcards, quiz, chatHistory } = req.body;

    // Generate the beautiful HTML email
    const html = generateEmailTemplate({
      summary,
      flashcards,
      quiz,
      chatHistory,
    });

    const { data, error } = await resend.emails.send({
      from: "Study Buddy AI <onboarding@resend.dev>",
      to: email,
      subject: "📚 Your Study Buddy AI Report",
      html,
    });

    if (error) {
      console.log("Resend Error:", error);
      return res.status(400).json({ error });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});