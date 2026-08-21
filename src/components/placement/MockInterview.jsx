// src/components/placement/MockInterview.jsx
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { startMockInterview, continueMockInterview } from '../../api/groq';
import {
  Mic,
  Send,
  Loader2,
  Sparkles,
  User,
  Bot,
  Briefcase,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  Zap
} from 'lucide-react';

export default function MockInterview() {
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started]);

  const handleStart = async () => {
    setLoading(true);
    setStarted(true);
    setMessages([]);

    const prompt = `You are an expert technical interviewer interviewing a candidate for a ${jobRole} role. 
    Start the interview by greeting the candidate and asking the first question (e.g., "Tell me about yourself" or a basic technical question). 
    Ask one question at a time. Wait for the candidate's response.
    
    IMPORTANT RULE: If the candidate asks you a question (for example: "What is a closure?" or "Can you explain that?"), answer their question clearly and helpfully. After answering their question, resume the interview by asking your next question.`;

    setSystemPrompt(prompt);

    try {
      const response = await startMockInterview(jobRole);
      const aiMessage = response.choices[0].message;
      setMessages([{ role: 'assistant', content: aiMessage.content }]);
    } catch (error) {
      toast.error('Failed to start interview.');
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const fullConversation = [
        { role: 'system', content: systemPrompt },
        ...newMessages
      ];

      const response = await continueMockInterview(fullConversation);
      const aiMessage = response.choices[0].message;
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage.content }]);
    } catch (error) {
      toast.error('Failed to get response from interviewer.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setMessages([]);
    setInput('');
    setSystemPrompt('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1e] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">
                Mock Interview
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {started ? `Interviewing for ${jobRole}` : 'Practice with AI-powered interviews'}
              </p>
            </div>
          </div>

          {started && (
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all duration-200 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              New Interview
            </button>
          )}
        </div>

        {/* Job Role Input */}
        {!started && (
          <div className="bg-[#151b2e] border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Briefcase className="w-4 h-4 text-violet-400" />
              Target Job Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#0b0f1e] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all duration-200 font-medium"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>
        )}

        {/* Start Button */}
        {!started && (
          <button
            onClick={handleStart}
            disabled={loading}
            className={`
              w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 text-base
              ${loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting interview...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Start Interview
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}

        {/* Feature badges */}
        {!started && (
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 py-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Real-time Q&A</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant Feedback</span>
            </div>
          </div>
        )}

        {/* Main Chat Card */}
        <div className="bg-[#151b2e] border border-slate-700/50 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
          {!started ? (
            /* Setup Screen */
            <div className="flex flex-col items-center justify-center p-16 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-violet-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="text-center space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-white">Ready to practice?</h2>
                <p className="text-slate-400">
                  Enter your target role above and start a realistic technical interview with our AI interviewer.
                </p>
              </div>
            </div>
          ) : (
            /* Chat Screen */
            <>
              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-[#0b0f1e]/50">
                {messages.length === 0 && !loading && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-3 opacity-50">
                      <Loader2 className="w-8 h-8 text-slate-600 animate-spin mx-auto" />
                      <p className="text-slate-500">Initializing interviewer...</p>
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`
                      w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg
                      ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/20'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                      }
                    `}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`
                      max-w-[75%] p-4 rounded-2xl shadow-md
                      ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-sm shadow-violet-500/10'
                        : 'bg-[#1e2746] border border-slate-700/50 text-slate-200 rounded-tl-sm'
                      }
                    `}>
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => (
                              <strong className={`font-semibold ${msg.role === 'user' ? 'text-white' : 'text-violet-300'}`}>
                                {children}
                              </strong>
                            ),
                            code: ({ children }) => (
                              <code className={`
                                px-1.5 py-0.5 rounded text-xs font-mono
                                ${msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-slate-800 text-violet-300'}
                              `}>
                                {children}
                              </code>
                            ),
                            ul: ({ children }) => <ul className="space-y-1 mb-2">{children}</ul>,
                            li: ({ children }) => (
                              <li className="flex items-start gap-2">
                                <span className="text-violet-400 mt-1">•</span>
                                <span>{children}</span>
                              </li>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && messages.length > 0 && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#1e2746] border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-slate-400 italic">Interviewer is typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700/50 bg-[#151b2e]">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your answer... (Shift+Enter for new line)"
                      rows={1}
                      className="w-full p-3.5 pr-12 bg-[#0b0f1e] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all duration-200 resize-none min-h-[48px] max-h-[120px] text-sm leading-relaxed"
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-slate-600 pointer-events-none">
                      {input.length > 0 && `${input.length} chars`}
                    </div>
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className={`
                      p-3.5 rounded-xl transition-all duration-200 flex items-center justify-center
                      ${loading || !input.trim()
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2 text-center">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">Shift+Enter</kbd> for new line
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}