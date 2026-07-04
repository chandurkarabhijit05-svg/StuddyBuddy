const API_URL = "http://localhost:5000";

export const generateSummary = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${API_URL}/api/summary`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};

export const generateFlashcards = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${API_URL}/api/flashcards`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};

export const generateQuiz = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${API_URL}/api/quiz`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};

// ✅ ADD THIS (FIX)
export const getDashboard = async (userId) => {
  const res = await fetch(
    `http://localhost:5000/api/dashboard/${userId}`
  );

  return await res.json();
};
export const deletePDF = async (id) => {
  const res = await fetch(`http://localhost:5000/api/pdf/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};