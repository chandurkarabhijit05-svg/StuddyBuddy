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
          content: "You are an expert study assistant. Create clear, concise, well-structured summaries of academic content. Use bullet points and headers where appropriate."
        },
        {
          role: "user",
          content: `Summarize the following PDF content in a clear and structured way. Include key points, main ideas, and important details:\n\n${text}`
        },
      ],
      model: "llama-3.3-70b-versatile",
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
          content: "You are an expert study assistant. Create flashcards in a strict format. Each flashcard must follow this exact pattern:\n\nCard N:\nFront: [question or concept]\nBack: [answer or explanation]\n\nUse this exact format for every card. Number cards sequentially."
        },
        {
          role: "user",
          content: `Create flashcards from the following PDF content. Cover all key concepts, definitions, and important details. Use the exact format specified:\n\n${text}`
        },
      ],
      model: "llama-3.3-70b-versatile",
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
          content: `You are an expert quiz generator. Create multiple choice quizzes with exactly 4 options (A, B, C, D) per question. 

STRICT FORMAT - Follow this exact pattern for every question:

Question N: [Question text]

A. [Option A]
B. [Option B]
C. [Option C]
D. [Option D]

Correct Answer: [A/B/C/D]

Explanation: [Brief explanation of why this is correct]

---

Repeat this format for each question. Always include the correct answer and explanation.`
        },
        {
          role: "user",
          content: `Generate a quiz from the following PDF content. Create questions that test understanding of key concepts. Use the exact format specified above:\n\n${text}`
        },
      ],
      model: "llama-3.3-70b-versatile",
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
      model: "llama-3.3-70b-versatile",
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