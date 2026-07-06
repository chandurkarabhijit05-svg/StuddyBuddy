import { useEffect, useState } from 'react'
import { getUserStats } from '../api/stats.js'
import Analytics from './Analytics.jsx'

export default function AnalyticsWrapper() {
  const [stats, setStats] = useState({
    totalPDFs: 0,
    totalSummaries: 0,
    totalFlashcards: 0,
    totalQuizzes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // TODO: Replace with actual auth user ID from Supabase auth
        const userId = 'user-id'
        const data = await getUserStats(userId)
        setStats(data)
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400 text-lg">Loading analytics...</div>
      </div>
    )
  }

  return <Analytics {...stats} />
}