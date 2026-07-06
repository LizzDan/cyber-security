import React, { useState, useEffect } from "react";
import { StudentResponse } from "./types";
import { generateMockStudentData } from "./data/mockStudentData";
import ResearchOverview from "./components/ResearchOverview";
import StudentSurvey from "./components/StudentSurvey";
import AnalyticsCenter from "./components/AnalyticsCenter";
import AIAdvisor from "./components/AIAdvisor";
import { 
  Shield, 
  Activity, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Lock,
  Globe,
  HelpCircle,
  TrendingUp,
  Server
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [userProfile, setUserProfile] = useState<StudentResponse | null>(null);

  // Load pre-populated dataset on mount
  useEffect(() => {
    const seedData = generateMockStudentData();
    setResponses(seedData);
  }, []);

  // Handle a new student survey submission
  const handleAddResponse = (newResponse: StudentResponse) => {
    setResponses((prev) => [newResponse, ...prev]);
    setUserProfile(newResponse);
  };

  // Organic transition from diagnostic report card to custom Gemini AI advisory tab
  const handleNavigateToAI = (profile: StudentResponse) => {
    setUserProfile(profile);
    setActiveTab("ai");
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabNavigation = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="app-root">
      
      {/* Upper Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Study Topic */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-900/60 rounded-xl text-emerald-400">
              <Shield className="h-5.5 w-5.5" />
            </div>
            <div>
              <div className="text-sm font-black text-white uppercase tracking-wider font-sans">
                Cyber-Aware & Analytics Portal
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate max-w-[280px] sm:max-w-md">
                Nigerian Universities Research Case Study
              </div>
            </div>
          </div>

          {/* Tab Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "overview", label: "Research Overview", icon: BookOpen },
              { id: "survey", label: "Diagnostic Survey", icon: Activity },
              { id: "analytics", label: "Analytics Engine", icon: Cpu },
              { id: "ai", label: "AI Threat Analyst", icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => handleTabNavigation(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                    activeTab === tab.id
                      ? "bg-slate-900 border-slate-800 text-emerald-400 shadow"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Right Badges */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 text-[9px] font-mono font-bold text-slate-400">
              <Server className="h-3 w-3 text-emerald-500" /> API: Live
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
              <Globe className="h-3 w-3" /> NG-NODE
            </span>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Render active tabs */}
        {activeTab === "overview" && (
          <ResearchOverview 
            responses={responses} 
            onNavigate={handleTabNavigation} 
          />
        )}

        {activeTab === "survey" && (
          <StudentSurvey 
            onAddResponse={handleAddResponse} 
            onNavigateToAI={handleNavigateToAI} 
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsCenter 
            responses={responses} 
          />
        )}

        {activeTab === "ai" && (
          <AIAdvisor 
            userProfile={userProfile} 
            onNavigateToSurvey={() => handleTabNavigation("survey")} 
          />
        )}

      </main>

      {/* Persistent Bottom Mobile Nav Bar (only visible on small viewports) */}
      <div className="sticky bottom-0 z-40 bg-slate-950/95 border-t border-slate-900 md:hidden py-1 px-2 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "survey", label: "Survey", icon: Activity },
            { id: "analytics", label: "Analytics", icon: Cpu },
            { id: "ai", label: "AI Analyst", icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => handleTabNavigation(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[9px] font-medium transition ${
                  activeTab === tab.id
                    ? "text-emerald-400 font-bold bg-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4.5 w-4.5 mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unified Research Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-sans">
          <div className="text-center md:text-left space-y-1">
            <span className="block font-bold text-slate-400">CYBER SECURITY AWARENESS AND THE ROLE OF DATA ANALYTICS IN PREVENTING CYBERCRIME</span>
            <span className="block text-[10px]">A case study of university institutions in Nigeria (UNILAG, UI, OAU, ABU, UNN, etc.).</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono">
            <span>Data Compliance: NDPR-certified</span>
            <span>Security Framework: ISO/IEC 27001</span>
            <span>Study Version: v1.1.0-Release</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
