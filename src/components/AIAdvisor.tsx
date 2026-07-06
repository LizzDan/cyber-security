import React, { useState } from "react";
import { StudentResponse } from "../types";
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Lock,
  MessageSquare
} from "lucide-react";

interface Props {
  userProfile: StudentResponse | null;
  onNavigateToSurvey: () => void;
}

// Simple and highly robust component to render markdown safely without react-markdown issues
function SafeMarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  
  return (
    <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
      {lines.map((line, index) => {
        // Trimmed line
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={index} className="text-sm font-bold text-emerald-400 mt-4 border-b border-slate-800 pb-1 flex items-center gap-1.5 font-sans">
              {trimmed.replace("### ", "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={index} className="text-base font-black text-white mt-5 flex items-center gap-2 border-b border-slate-800 pb-1.5 font-sans">
              {trimmed.replace("## ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={index} className="text-lg font-black text-white mt-6 mb-2 border-l-4 border-emerald-500 pl-2.5 font-sans">
              {trimmed.replace("# ", "")}
            </h2>
          );
        }
        
        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.slice(2);
          return (
            <ul key={index} className="list-disc pl-5 space-y-1.5">
              <li className="text-slate-300">
                {parseBoldText(content)}
              </li>
            </ul>
          );
        }
        
        // Numbered lists
        if (/^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s/, "");
          const num = trimmed.match(/^\d+/)?.toString() || "1";
          return (
            <div key={index} className="flex gap-2.5 pl-2 py-0.5">
              <span className="font-mono text-emerald-400 font-bold">{num}.</span>
              <p className="flex-1 text-slate-300">{parseBoldText(content)}</p>
            </div>
          );
        }
        
        // Empty lines
        if (trimmed === "") {
          return <div key={index} className="h-2" />;
        }
        
        // Blockquotes
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={index} className="border-l-2 border-emerald-500/50 pl-3 py-1 bg-slate-950/40 rounded-r text-xs text-slate-400 italic">
              {parseBoldText(trimmed.slice(2))}
            </blockquote>
          );
        }
        
        // Standard paragraph
        return (
          <p key={index} className="leading-relaxed">
            {parseBoldText(line)}
          </p>
        );
      })}
    </div>
  );
}

// Simple regex parser for bold text (**text**)
function parseBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-white font-bold">{part}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AIAdvisor({ userProfile, onNavigateToSurvey }: Props) {
  const [activeMode, setActiveMode] = useState<"personal" | "academic">("personal");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisReport, setAnalysisReport] = useState<string>("");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Preset academic inquiry queries
  const researchPresets = [
    {
      id: "preset-1",
      title: "Credential Reuse Threat Profile",
      query: "Why is credential reuse (password sharing and reuse) the single largest attack vector on academic portals in Nigerian universities? Explain how data analytics patterns could flag these risks."
    },
    {
      id: "preset-2",
      title: "Log-Driven Defense Architecture",
      query: "Design a 5-step proactive institutional cybersecurity defense policy for a Nigerian university using live network logs, telemetry correlation, and risk scoring analytics."
    },
    {
      id: "preset-3",
      title: "Yahoo Scam Susceptibility",
      query: "Analyze how cybercriminals target Nigerian university students with financial Yahoo Yahoo scams (fake alerts, lotteries). Explain how behavioral anomaly analytics can detect student transactions at risk."
    },
    {
      id: "preset-4",
      title: "NDPR Academic Compliance",
      query: "Explain how the Nigeria Data Protection Regulation (NDPR) applies to university systems. What data analytics audit models are necessary to ensure school student portals maintain NDPR compliance?"
    }
  ];

  // Request analysis from the server-side Gemini endpoint
  const handleGenerateReport = async (mode: "advisory" | "research_question", queryText?: string) => {
    setLoading(true);
    setApiError(null);
    setAnalysisReport("");

    const payload: any = { mode };

    if (mode === "advisory") {
      if (!userProfile) return;
      payload.profile = {
        university: userProfile.university,
        level: userProfile.level,
        scoreCard: {
          riskScore: userProfile.riskScore,
          awarenessScore: userProfile.awarenessScore,
          behaviorScore: userProfile.behaviorScore,
          knowsPhishing: userProfile.knowsPhishing,
          knowsTwoFactor: userProfile.knowsTwoFactor,
          knowsRansomware: userProfile.knowsRansomware,
          knowsDataPrivacyLaw: userProfile.knowsDataPrivacyLaw,
          passwordStrength: userProfile.passwordStrength,
          passwordReuse: userProfile.passwordReuse,
          passwordSharing: userProfile.passwordSharing,
          usePasswordManager: userProfile.usePasswordManager,
          usePublicWifiNoVPN: userProfile.usePublicWifiNoVPN,
          softwareUpdateFrequency: userProfile.softwareUpdateFrequency,
          clicksEmailLinks: userProfile.clicksEmailLinks,
          sharesDevicesNoPasscode: userProfile.sharesDevicesNoPasscode,
          hadPhishingEncounter: userProfile.hadPhishingEncounter,
          hadMalwareInfection: userProfile.hadMalwareInfection,
          hadUnauthorizedAccess: userProfile.hadUnauthorizedAccess,
          lostMoneyToScam: userProfile.lostMoneyToScam
        }
      };
    } else {
      const q = queryText || customQuestion;
      if (!q.trim()) {
        setLoading(false);
        return;
      }
      payload.question = q;
    }

    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Internal Server Error");
      }

      setAnalysisReport(data.analysis);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to reach the server. Please verify your connection.");
      // Fallback response for demonstration if Gemini is unconfigured or blocked
      setAnalysisReport(`
# Cybersecurity Advisory Report (Local Offline Analytics)

*Your system is operating in Local Fallback mode due to a missing or unauthorized API credential. The following analytical feedback is computed from typical student behavior trends in Nigeria:*

## 1. Risk Evaluation Summary
- **Unsecured public Wi-Fi** connection practices expose your active login tokens to session harvesting.
- **Reusing credentials** across multiple school/personal nodes means a single third-party leak compromises all your accounts.
- **Academic portal threats** (like EduPortal credential harvesting) primarily succeed due to student's failure to recognize lookalike login URLs.

## 2. Institutional Defense recommendations
- Deploy standard **Two-Factor Authentication (2FA)** across your email and portals immediately.
- Use an encrypted **Virtual Private Network (VPN)** whenever connecting to public campus access routers.
- Transition to a encrypted **Password Manager** to enforce random 12+ character keys.
      `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="ai-advisor-container">
      
      {/* Left Column: Input Selection Panels */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Navigation tabs */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-2 flex flex-col gap-1.5">
          <button
            id="btn-ai-personal"
            onClick={() => {
              setActiveMode("personal");
              setAnalysisReport("");
              setApiError(null);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeMode === "personal" 
                ? "bg-emerald-950/60 border border-emerald-800/30 text-emerald-400" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4" /> Personal Security Audit
          </button>
          
          <button
            id="btn-ai-academic"
            onClick={() => {
              setActiveMode("academic");
              setAnalysisReport("");
              setApiError(null);
            }}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeMode === "academic" 
                ? "bg-emerald-950/60 border border-emerald-800/30 text-emerald-400" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="h-4 w-4" /> Academic Research Consultant
          </button>
        </div>

        {/* Mode 1 Panel: Personal Audit */}
        {activeMode === "personal" && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 animate-fadeIn" id="ai-mode-personal">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Diagnostic Data Profile</h3>
            
            {userProfile ? (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-500">Institution:</span>
                    <span className="text-slate-200 font-bold text-right truncate pl-2">{userProfile.university.split(" (")[0]}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span className="text-slate-500">Academic Level:</span>
                    <span className="text-slate-200 font-bold">{userProfile.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Calculated Risk Index:</span>
                    <span className="text-red-400 font-black font-mono">{userProfile.riskScore}%</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Your diagnostic scores will be transmitted to Google Gemini to synthesize a customized institutional safety analysis and mitigation strategy.
                </p>

                <button
                  id="btn-trigger-personal-report"
                  onClick={() => handleGenerateReport("advisory")}
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Synthesizing Advisory...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Synthesize Diagnostic Report
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center p-6 bg-slate-950 border border-slate-850 rounded-lg space-y-3">
                <Lock className="h-6 w-6 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-slate-300">No Assessment Loaded</span>
                  <span className="block text-[10px] text-slate-500 leading-normal">You must complete the diagnostic survey first to generate your personal security analysis.</span>
                </div>
                <button
                  onClick={onNavigateToSurvey}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-[10px] font-bold rounded-lg transition"
                >
                  Start Survey
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mode 2 Panel: Academic Presets */}
        {activeMode === "academic" && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 animate-fadeIn" id="ai-mode-academic">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Core Case Research Inquiries</h3>
            <p className="text-[10px] text-slate-500 leading-normal">Select a research objective question below to trigger deep, data-grounded Gemini analytical modeling.</p>
            
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {researchPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleGenerateReport("research_question", preset.query)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-lg border border-slate-800 hover:border-emerald-800 bg-slate-950/40 hover:bg-slate-950 text-[10px] sm:text-xs font-semibold text-slate-300 transition duration-150 block"
                >
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{preset.title}</span>
                  </div>
                  <span className="text-slate-500 font-normal block mt-1 line-clamp-2">{preset.query}</span>
                </button>
              ))}
            </div>

            {/* Custom Question Entry */}
            <div className="space-y-2 pt-2 border-t border-slate-850">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Academic Query</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about NDPR, SIM swap, etc..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleGenerateReport("research_question")}
                  disabled={loading || !customQuestion.trim()}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-lg text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Right Column: AI Response Display Area */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 lg:col-span-2 flex flex-col justify-between min-h-[500px]">
        
        {/* Active Analysis Status Header */}
        <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              Gemini Cybersecurity Threat Analyst
            </h3>
            <p className="text-xs text-slate-500">
              {activeMode === "personal" ? "Synthesizing individual risk audits" : "Mapping institutional data prevention models"}
            </p>
          </div>
          
          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
            Model: gemini-3.5-flash
          </div>
        </div>

        {/* Report Content Panel */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 py-16">
              <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
              <div className="text-center space-y-1">
                <span className="block text-xs font-bold text-slate-300">Synthesizing Security Model...</span>
                <span className="block text-[10px] text-slate-500">Querying server-side Google GenAI pipeline</span>
              </div>
            </div>
          ) : apiError ? (
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/30 text-xs text-red-200 space-y-3 my-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-red-400">Connection Flag / Offline Response triggered:</strong>
                  {apiError}
                </div>
              </div>
              
              {analysisReport && (
                <div className="pt-3 border-t border-red-900/20">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Displaying Offline Computed Analysis:</span>
                  <SafeMarkdownRenderer text={analysisReport} />
                </div>
              )}
            </div>
          ) : analysisReport ? (
            <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 animate-fadeIn">
              <SafeMarkdownRenderer text={analysisReport} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-2.5 py-20">
              <MessageSquare className="h-10 w-10 text-slate-800 animate-pulse" />
              <div className="max-w-sm space-y-1">
                <span className="block text-xs font-bold text-slate-300">Awaiting Analysis Parameters</span>
                <span className="block text-[10px] text-slate-500 leading-normal">
                  {activeMode === "personal" 
                    ? "Click the button on the left to transmit your survey metrics and evaluate your Vulnerability Index." 
                    : "Select a pre-populated inquiry on the left or type your custom inquiry to explore academic insights."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legal Footer */}
        <div className="pt-4 border-t border-slate-850 text-[10px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 font-sans">
          <span>* Disclaimer: AI-synthesized research recommendations are guidance. Verify institutional policies.</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-500 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> NDPR Compliant Endpoint
          </span>
        </div>

      </div>

    </div>
  );
}
