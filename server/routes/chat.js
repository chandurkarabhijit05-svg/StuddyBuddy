router.post("/chat", async (req, res) => {
  const { pdfId, question } = req.body;

  // We'll implement the AI logic in Part 42

  res.json({
    answer: "AI response will come in Part 42."
  });
});