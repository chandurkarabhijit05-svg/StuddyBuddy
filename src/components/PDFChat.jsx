import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { askGroq } from '../api/groq.js'

export default function PDFChat({ pdfText }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const context = pdfText 
        ? `Based on this PDF content: "${pdfText.slice(0, 3000)}..."\n\nQuestion: ${input}`
        : input

      const response = await askGroq([
        { role: 'system', content: 'You are a helpful study assistant. Answer questions based on the provided PDF content.' },
        { role: 'user', content: context }
      ])

      const botReply = response.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && <Bot className="w-6 h-6 text-violet-400" />}
            <div className={`max-w-[80%] p-3 rounded-xl ${
              msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && <User className="w-6 h-6 text-cyan-400" />}
          </div>
        ))}
        {loading && <div className="text-slate-500">Thinking...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your PDF..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-lg"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}