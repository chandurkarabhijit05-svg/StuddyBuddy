// src/pages/PlacementGuide.jsx
import { useState } from 'react';
import ResumeAnalyzer from '../components/placement/ResumeAnalyzer';
import MockInterview from '../components/placement/MockInterview';
import {
  Sparkles,
  FileText,
  Mic,
  ChevronRight,
  ArrowUpRight,
  Target,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

export default function PlacementGuide() {
  const [activeTab, setActiveTab] = useState('resume');

  const tabs = [
    {
      id: 'resume',
      label: 'Resume Analyzer',
      icon: FileText,
      description: 'Get AI-powered feedback on your resume',
      color: 'from-violet-600 to-fuchsia-600',
      shadow: 'shadow-violet-500/25',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400'
    },
    {
      id: 'interview',
      label: 'Mock Interview',
      icon: Mic,
      description: 'Practice with our AI interviewer',
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/25',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400'
    }
  ];

  const features = [
    { icon: Target, label: 'ATS Optimized', color: 'text-violet-400' },
    { icon: Zap, label: 'Instant Feedback', color: 'text-amber-400' },
    { icon: Shield, label: 'Privacy First', color: 'text-emerald-400' },
    { icon: TrendingUp, label: 'Career Growth', color: 'text-sky-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1e]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-violet-400 font-medium">Placement Guide</span>
          </div>

          {/* Main Hero */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Tools
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">
                Placement Guide
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Analyze your resume or practice with our AI interviewer to land your dream job.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151b2e] border border-slate-700/50 text-sm"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-slate-300">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <div className="bg-[#151b2e] border border-slate-700/50 rounded-2xl p-2 flex gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300
                  ${isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ${tab.shadow}`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isActive ? 'bg-white/20' : tab.iconBg}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tab.iconColor}`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{tab.label}</p>
                  <p className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                    {tab.description}
                  </p>
                </div>
                <ArrowUpRight className={`
                  w-5 h-5 ml-auto transition-transform duration-300
                  ${isActive ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-1 translate-y-1 opacity-0'}
                `} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Component */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'resume' ? <ResumeAnalyzer /> : <MockInterview />}
        </div>
      </div>
    </div>
  );
}