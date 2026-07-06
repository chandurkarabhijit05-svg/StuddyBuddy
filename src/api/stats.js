import supabase from "../services/supabase.js";

export async function getUserStats(userId) {
  // Get PDF count
  const { count: pdfCount } = await supabase
    .from('pdfs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get summaries count
  const { count: summaryCount } = await supabase
    .from('summaries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get flashcards count
  const { count: flashcardCount } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get quizzes count
  const { count: quizCount } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    totalPDFs: pdfCount || 0,
    totalSummaries: summaryCount || 0,
    totalFlashcards: flashcardCount || 0,
    totalQuizzes: quizCount || 0
  }
}