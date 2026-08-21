// src/components/placement/ResumeAnalyzer.jsx
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { extractTextFromPDF } from '../../services/pdfExtractor';
import { analyzeResume } from '../../api/groq';
import {
  Upload,
  FileText,
  Sparkles,
  Briefcase,
  AlertCircle,
  Loader2,
  X,
  FileCheck,
  Star,
  Lightbulb,
  Target,
  Award,
  ChevronRight,
  Wrench,
  BookOpen,
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [parsedFeedback, setParsedFeedback] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected) => {
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setFeedback('');
      setParsedFeedback(null);
      toast.success('Resume uploaded successfully!');
    } else if (selected) {
      toast.error('Please upload a valid PDF file.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    validateAndSetFile(dropped);
  };

  const removeFile = () => {
    setFile(null);
    setFeedback('');
    setParsedFeedback(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const parseFeedback = (rawText) => {
    const sections = {
      overallScore: null,
      summary: '',
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missingSkills: [],
      formatting: [],
      atsScore: null,
      roleMatch: null
    };

    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);
    let currentSection = 'summary';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      if (lower.includes('overall') || lower.includes('score') || lower.includes('rating')) {
        const match = line.match(/(\d+)(?:\/10|\/100|%|\s*out\s*of\s*10)?/);
        if (match) sections.overallScore = parseInt(match[1]);
        currentSection = 'summary';
        continue;
      }
      if (lower.includes('strength') || lower.includes('good') || lower.includes('positive')) {
        currentSection = 'strengths';
        continue;
      }
      if (lower.includes('weakness') || lower.includes('improve') || lower.includes('issue') || lower.includes('gap')) {
        currentSection = 'weaknesses';
        continue;
      }
      if (lower.includes('suggestion') || lower.includes('recommend') || lower.includes('tip') || lower.includes('advice')) {
        currentSection = 'suggestions';
        continue;
      }
      if (lower.includes('skill') || lower.includes('missing') || lower.includes('keyword')) {
        currentSection = 'missingSkills';
        continue;
      }
      if (lower.includes('format') || lower.includes('layout') || lower.includes('structure') || lower.includes('design')) {
        currentSection = 'formatting';
        continue;
      }
      if (lower.includes('ats') || lower.includes('applicant tracking')) {
        const match = line.match(/(\d+)(?:\/10|\/100|%)?/);
        if (match) sections.atsScore = parseInt(match[1]);
        currentSection = 'formatting';
        continue;
      }
      if (lower.includes('match') || lower.includes('fit') || lower.includes('role')) {
        const match = line.match(/(\d+)(?:\/10|\/100|%)?/);
        if (match) sections.roleMatch = parseInt(match[1]);
        currentSection = 'summary';
        continue;
      }

      if (line.startsWith('#') || line.startsWith('---') || (line.startsWith('**') && line.endsWith('**'))) {
        continue;
      }

      const cleanLine = line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (!cleanLine) continue;

      if (currentSection === 'strengths') sections.strengths.push(cleanLine);
      else if (currentSection === 'weaknesses') sections.weaknesses.push(cleanLine);
      else if (currentSection === 'suggestions') sections.suggestions.push(cleanLine);
      else if (currentSection === 'missingSkills') sections.missingSkills.push(cleanLine);
      else if (currentSection === 'formatting') sections.formatting.push(cleanLine);
      else if (currentSection === 'summary') sections.summary += cleanLine + ' ';
    }

    sections.summary = sections.summary.trim();
    return sections;
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first.');
      return;
    }
    setLoading(true);
    setFeedback('');
    setParsedFeedback(null);

    try {
      const text = await extractTextFromPDF(file);
      if (!text) throw new Error('Could not extract text. Is it an image-based PDF?');

      const response = await analyzeResume(text, jobRole);
      const rawFeedback = response.choices[0].message.content;
      setFeedback(rawFeedback);
      setParsedFeedback(parseFeedback(rawFeedback));
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreRing = (score) => {
    if (score >= 8) return 'stroke-emerald-400';
    if (score >= 6) return 'stroke-amber-400';
    return 'stroke-rose-400';
  };

  const ScoreRing = ({ score, label }) => {
    const size = 180;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min((score / 10) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1e2746"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className={getScoreRing(score)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
        <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  const SectionCard = ({ title, icon: Icon, items, color }) => {
    if (!items || items.length === 0) return null;

    const colorMap = {
      emerald: {
        header: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
        icon: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400',
      },
      violet: {
        header: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400',
        icon: 'text-violet-400',
        badge: 'bg-violet-500/20 text-violet-400',
      },
      amber: {
        header: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
        icon: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-400',
      },
      rose: {
        header: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
        icon: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-400',
      },
      sky: {
        header: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
        icon: 'text-sky-400',
        badge: 'bg-sky-500/20 text-sky-400',
      },
    };

    const colors = colorMap[color] || colorMap.violet;

    return (
      <div className="bg-[#0b0f1e] rounded-xl border border-slate-700/50 overflow-hidden" style={{ width: '100%' }}>
        <div className={`px-6 py-4 bg-gradient-to-r ${colors.header} border-b border-slate-700/50 flex items-center gap-3`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
          <h4 className="text-base font-semibold text-white">{title}</h4>
          <span className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${colors.badge}`}>
            {items.length}
          </span>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${colors.icon}`} />
                <span className="break-words">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f1e] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">
              Resume Analyzer
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Upload your resume and get AI-powered feedback tailored to your dream role
            </p>
          </div>
        </div>

        {/* Job Role Card */}
        <div className="bg-[#151b2e] border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            <Briefcase className="w-4 h-4 text-violet-400" />
            Target Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full p-3.5 bg-[#0b0f1e] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all duration-200"
            placeholder="e.g. Frontend Developer"
          />
        </div>

        {/* Upload Card */}
        <div className="bg-[#151b2e] border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            <Upload className="w-4 h-4 text-violet-400" />
            Upload Resume
          </label>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
              ${dragActive
                ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-300 font-medium">
                    Drop your PDF here or <span className="text-violet-400">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Supports PDF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#0b0f1e] rounded-xl p-4 border border-slate-700" style={{ width: '100%' }}>
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm text-white font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="p-2 hover:bg-slate-700 rounded-xl transition-colors shrink-0 ml-4"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className={`
            w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 text-base
            ${loading || !file
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze My Resume
            </>
          )}
        </button>

        {/* Results Panel */}
        <div className="bg-[#151b2e] border border-slate-700/50 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
          <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Feedback</h3>
            </div>
            {parsedFeedback && (
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                Analysis Complete
              </span>
            )}
          </div>

          <div className="p-6 space-y-6">
            {!feedback && !loading && (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Ready to analyze</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Upload your resume and click analyze to get started
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="py-16 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium animate-pulse">Analyzing your resume...</p>
                  <p className="text-sm text-slate-500 mt-1">Our AI is reviewing your skills and experience</p>
                </div>
              </div>
            )}

            {parsedFeedback && !loading && (
              <div className="space-y-6">
                {/* Score Rings */}
                {(parsedFeedback.overallScore || parsedFeedback.atsScore || parsedFeedback.roleMatch) && (
                  <div className="bg-[#0b0f1e] rounded-xl p-8 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-8">
                      <Award className="w-5 h-5 text-violet-400" />
                      <h4 className="text-lg font-semibold text-white">Scores</h4>
                    </div>
                    <div className="flex justify-center items-center gap-16 flex-wrap">
                      {parsedFeedback.overallScore && (
                        <ScoreRing score={parsedFeedback.overallScore} label="Overall" />
                      )}
                      {parsedFeedback.atsScore && (
                        <ScoreRing score={parsedFeedback.atsScore} label="ATS" />
                      )}
                      {parsedFeedback.roleMatch && (
                        <ScoreRing score={parsedFeedback.roleMatch} label="Role Match" />
                      )}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {parsedFeedback.summary && (
                  <div className="bg-[#0b0f1e] rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-5 h-5 text-violet-400" />
                      <h4 className="text-lg font-semibold text-white">Summary</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {parsedFeedback.summary}
                    </p>
                  </div>
                )}

                {/* ALL CARDS - FULL WIDTH, NO GRID */}
                <SectionCard
                  title="Strengths"
                  icon={Star}
                  items={parsedFeedback.strengths}
                  color="emerald"
                />

                <SectionCard
                  title="Areas to Improve"
                  icon={AlertCircle}
                  items={parsedFeedback.weaknesses}
                  color="rose"
                />

                <SectionCard
                  title="Missing Skills / Keywords"
                  icon={Wrench}
                  items={parsedFeedback.missingSkills}
                  color="amber"
                />

                <SectionCard
                  title="Suggestions"
                  icon={Lightbulb}
                  items={parsedFeedback.suggestions}
                  color="sky"
                />

                <SectionCard
                  title="Formatting & Structure"
                  icon={BookOpen}
                  items={parsedFeedback.formatting}
                  color="violet"
                />

                {/* Raw fallback */}
                {!parsedFeedback.summary &&
                  parsedFeedback.strengths.length === 0 &&
                  parsedFeedback.weaknesses.length === 0 &&
                  parsedFeedback.suggestions.length === 0 &&
                  parsedFeedback.missingSkills.length === 0 &&
                  parsedFeedback.formatting.length === 0 && (
                    <div className="bg-[#0b0f1e] rounded-xl p-6 border border-slate-700/50">
                      <div className="prose prose-invert prose-violet max-w-none">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}