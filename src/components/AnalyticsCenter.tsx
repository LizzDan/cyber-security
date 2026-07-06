import React, { useState, useEffect, useRef } from "react";
import { 
  StudentResponse, 
  NetworkLog, 
  AnalyticsRule, 
  University,
  AcademicLevel
} from "../types";
import { 
  generateNetworkLogs, 
  defaultRules 
} from "../data/mockStudentData";
import { 
  Cpu, 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertOctagon, 
  Play, 
  Pause, 
  RotateCcw,
  Plus,
  Trash2,
  TrendingDown,
  Percent,
  Filter,
  BarChart2,
  HelpCircle,
  Database,
  Lock,
  Wifi,
  Mail,
  ShieldCheck,
  Zap
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";

interface Props {
  responses: StudentResponse[];
}

export default function AnalyticsCenter({ responses }: Props) {
  // Navigation within the tab
  const [activeSubTab, setActiveSubTab] = useState<"miner" | "simulator">("miner");

  // --- SUBTAB 1: Exploratory Data Miner ---
  const [selectedUni, setSelectedUni] = useState<string>("ALL");
  const [selectedLvl, setSelectedLvl] = useState<string>("ALL");
  const [filterPasswordReuse, setFilterPasswordReuse] = useState<boolean>(false);
  const [filterPublicWifi, setFilterPublicWifi] = useState<boolean>(false);
  const [filterClicksLinks, setFilterClicksLinks] = useState<boolean>(false);

  // Filtered dataset
  const filteredData = responses.filter(r => {
    if (selectedUni !== "ALL" && r.university !== selectedUni) return false;
    if (selectedLvl !== "ALL" && r.level !== selectedLvl) return false;
    if (filterPasswordReuse && !r.passwordReuse) return false;
    if (filterPublicWifi && !r.usePublicWifiNoVPN) return false;
    if (filterClicksLinks && r.clicksEmailLinks !== "often") return false;
    return true;
  });

  // Calculations for filtered data
  const filteredCount = filteredData.length;
  const avgFilteredRisk = filteredCount > 0 
    ? Math.round(filteredData.reduce((sum, r) => sum + r.riskScore, 0) / filteredCount) 
    : 0;
  const avgFilteredAwareness = filteredCount > 0 
    ? Math.round(filteredData.reduce((sum, r) => sum + r.awarenessScore, 0) / filteredCount) 
    : 0;
  const avgFilteredBehavior = filteredCount > 0 
    ? Math.round(filteredData.reduce((sum, r) => sum + r.behaviorScore, 0) / filteredCount) 
    : 0;

  // Correlation: Behavior vs attack count
  const attackEncounterRates = [
    { 
      name: "Phishing Links", 
      rate: filteredCount > 0 ? Math.round((filteredData.filter(r => r.hadPhishingEncounter).length / filteredCount) * 100) : 0,
      color: "#38bdf8"
    },
    { 
      name: "Malware Infection", 
      rate: filteredCount > 0 ? Math.round((filteredData.filter(r => r.hadMalwareInfection).length / filteredCount) * 100) : 0,
      color: "#fb923c"
    },
    { 
      name: "Account Compromise", 
      rate: filteredCount > 0 ? Math.round((filteredData.filter(r => r.hadUnauthorizedAccess).length / filteredCount) * 100) : 0,
      color: "#f87171"
    },
    { 
      name: "Scam Financial Loss", 
      rate: filteredCount > 0 ? Math.round((filteredData.filter(r => r.lostMoneyToScam).length / filteredCount) * 100) : 0,
      color: "#c084fc"
    },
  ];

  // Radar Data for safety behavior weaknesses (The closer to 100, the SAFER they are)
  const reuseSafeRate = filteredCount > 0 ? Math.round((filteredData.filter(r => !r.passwordReuse).length / filteredCount) * 100) : 0;
  const wifiSafeRate = filteredCount > 0 ? Math.round((filteredData.filter(r => !r.usePublicWifiNoVPN).length / filteredCount) * 100) : 0;
  const sharingSafeRate = filteredCount > 0 ? Math.round((filteredData.filter(r => !r.passwordSharing).length / filteredCount) * 100) : 0;
  const linkSafeRate = filteredCount > 0 ? Math.round((filteredData.filter(r => r.clicksEmailLinks === "never").length / filteredCount) * 100) : 0;
  const deviceSafeRate = filteredCount > 0 ? Math.round((filteredData.filter(r => !r.sharesDevicesNoPasscode).length / filteredCount) * 100) : 0;

  const vulnerabilityRadarData = [
    { subject: "Unique Passwords", value: reuseSafeRate },
    { subject: "VPN on Public Wi-Fi", value: wifiSafeRate },
    { subject: "No Password Sharing", value: sharingSafeRate },
    { subject: "Avoid Suspicious Links", value: linkSafeRate },
    { subject: "Passcode-Protected Device", value: deviceSafeRate },
  ];

  // Correlation: Risk Level scatter chart coordinates (Awareness vs behavior)
  const scatterData = filteredData.map(r => ({
    x: r.awarenessScore,
    y: r.behaviorScore,
    risk: r.riskScore,
    name: r.university.split(" (")[0]
  }));

  // --- SUBTAB 2: Analytics Simulator ---
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1000); // ms
  const [rules, setRules] = useState<AnalyticsRule[]>(defaultRules);
  const [networkLogs, setNetworkLogs] = useState<NetworkLog[]>([]);
  const [processedLogs, setProcessedLogs] = useState<NetworkLog[]>([]);
  const [stats, setStats] = useState({
    scanned: 0,
    blocked: 0,
    alerts: 0,
    clean: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rawLogsIndexRef = useRef<number>(0);

  // Initialize network logs once on load
  useEffect(() => {
    const initialLogs = generateNetworkLogs(responses);
    setNetworkLogs(initialLogs);
  }, [responses]);

  // Handle live simulation ticking
  useEffect(() => {
    if (!isPlaying || networkLogs.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      // Get next raw log
      const logIndex = rawLogsIndexRef.current % networkLogs.length;
      const rawLog = networkLogs[logIndex];
      rawLogsIndexRef.current++;

      // Process raw log through engagement rules
      let processedLog = { ...rawLog };
      processedLog.id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      let isBlocked = false;
      let isAlerted = false;
      let analyticsMemo = processedLog.details;

      rules.forEach(rule => {
        if (!rule.enabled) return;

        // Rule logic: Brute force / Multiple failures
        if (rule.conditionType === "multiple_failures" && rawLog.action === "Brute Force Warning") {
          isBlocked = true;
          analyticsMemo = `[BLOCKED BY ANALYTICS] Rule triggered: "${rule.name}" engaged. Automatically isolated connection after repeated dictionary validation failure.`;
        }

        // Rule logic: Insecure Wi-Fi without VPN
        if (rule.conditionType === "public_wifi_no_vpn" && rawLog.isPublicWifi && !rawLog.hasVPN) {
          isAlerted = true;
          analyticsMemo = `[ALERT / UNSECURED TRAFFIC] Rule engaged: "${rule.name}". Unencrypted login stream flagged. Dispatched push advisory to student's registered mobile endpoint.`;
        }

        // Rule logic: Weak Password Usage
        if (rule.conditionType === "weak_password_usage" && rawLog.passwordAttempt && rawLog.passwordAttempt !== "•••••••••••••") {
          isAlerted = true;
          analyticsMemo = `[WARN / CRITICAL HYGIENE] Rule engaged: "${rule.name}". Intercepted transmission of simple credentials: "${rawLog.passwordAttempt}". Restricting authentication state.`;
        }

        // Rule logic: Phishing Links click behavior
        if (rule.conditionType === "unsafe_links" && rawLog.action === "Suspicious Link Clicked") {
          isBlocked = true;
          analyticsMemo = `[INTERCEPTED BY IPS] Rule triggered: "${rule.name}". Outbound request domain mapped to verified credential harvester. Blocked packet routing.`;
        }
      });

      // Update statuses
      if (isBlocked) {
        processedLog.status = "blocked";
        processedLog.details = analyticsMemo;
      } else if (isAlerted) {
        processedLog.status = "flagged";
        processedLog.details = analyticsMemo;
      }

      // Add to processed log stack (keep last 30 logs)
      setProcessedLogs(prev => [processedLog, ...prev.slice(0, 29)]);

      // Update dynamic scoring stats
      setStats(prev => {
        const nextScanned = prev.scanned + 1;
        let nextBlocked = prev.blocked;
        let nextAlerts = prev.alerts;
        let nextClean = prev.clean;

        if (processedLog.status === "blocked") nextBlocked++;
        else if (processedLog.status === "flagged" || processedLog.status === "warning") nextAlerts++;
        else nextClean++;

        return { scanned: nextScanned, blocked: nextBlocked, alerts: nextAlerts, clean: nextClean };
      });

    }, simulationSpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, networkLogs, rules, simulationSpeed]);

  // Engage/Disengage active rules
  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleClearSimulator = () => {
    setProcessedLogs([]);
    setStats({ scanned: 0, blocked: 0, alerts: 0, clean: 0 });
    rawLogsIndexRef.current = 0;
  };

  // Inject a manual simulated brute-force attack to demonstrate action
  const triggerSimulatedAttack = () => {
    const attackLog: NetworkLog = {
      id: `attack-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      studentId: "std-attack",
      university: University.OAU,
      ipAddress: "41.190.2.145",
      action: "Brute Force Warning",
      service: "EduPortal",
      status: "flagged",
      details: "High frequency failed authentications (18 requests/sec) attempting common Nigerian credentials.",
      deviceType: "Laptop",
      isPublicWifi: false,
      hasVPN: false,
      passwordAttempt: "unilag123"
    };

    setNetworkLogs(prev => [attackLog, ...prev]);
    rawLogsIndexRef.current = 0; // Force immediate simulation of the attack
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div className="space-y-6" id="analytics-center-container">
      
      {/* Subtab Navigation header */}
      <div className="flex border-b border-slate-800 p-1 bg-slate-950/60 rounded-xl max-w-md">
        <button
          id="btn-active-miner"
          onClick={() => setActiveSubTab("miner")}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
            activeSubTab === "miner" 
              ? "bg-slate-900 border border-slate-800 text-white shadow" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Database className="h-4 w-4" /> Research Data Miner (Obj iii)
        </button>
        <button
          id="btn-active-simulator"
          onClick={() => setActiveSubTab("simulator")}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
            activeSubTab === "simulator" 
              ? "bg-slate-900 border border-slate-800 text-white shadow" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="h-4 w-4" /> Log Analytics Engine (Obj ii)
        </button>
      </div>

      {/* SUBTAB 1: Exploratory Data Miner */}
      {activeSubTab === "miner" && (
        <div className="space-y-6 animate-fadeIn" id="data-miner-content">
          
          {/* Statistical Filter Box */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-400" /> Multi-Variable Data Filters (Analytical Miner)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400">Institutional Filter</label>
                <select 
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Universities</option>
                  {Object.values(University).map((uni) => (
                    <option key={uni} value={uni}>{uni.split(" (")[0]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400">Academic Level Filter</label>
                <select 
                  value={selectedLvl}
                  onChange={(e) => setSelectedLvl(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Levels</option>
                  {Object.values(AcademicLevel).map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Behavior switches */}
              <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-4 items-end py-1.5">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={filterPasswordReuse}
                    onChange={(e) => setFilterPasswordReuse(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                  />
                  <span className="text-[11px] text-slate-300 font-medium">Reuses Passwords</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={filterPublicWifi}
                    onChange={(e) => setFilterPublicWifi(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                  />
                  <span className="text-[11px] text-slate-300 font-medium">Unsecured Wi-Fi Users</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={filterClicksLinks}
                    onChange={(e) => setFilterClicksLinks(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                  />
                  <span className="text-[11px] text-slate-300 font-medium">Frequent Link Clickers</span>
                </label>
              </div>

            </div>
          </div>

          {/* Aggregated Filter Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1 text-center">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Cohort Size</span>
              <div className="text-2xl font-black text-white font-mono">{filteredCount}</div>
              <p className="text-[9px] text-slate-500">Matching criteria ({Math.round((filteredCount / responses.length) * 100)}% of total)</p>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1 text-center">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Cohort Avg Risk Level</span>
              <div className="text-2xl font-black text-red-400 font-mono">{avgFilteredRisk}%</div>
              <p className="text-[9px] text-slate-500">Determined susceptibility weight</p>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1 text-center">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Avg Literacy Score</span>
              <div className="text-2xl font-black text-sky-400 font-mono">{avgFilteredAwareness}%</div>
              <p className="text-[9px] text-slate-500">Security concepts comprehension</p>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1 text-center">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Avg Safe Habit Index</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{avgFilteredBehavior}%</div>
              <p className="text-[9px] text-slate-500">Compliance with safety best practices</p>
            </div>

          </div>

          {/* Deep Pattern Mining Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Behavior Safety Radar */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Vulnerability Defense Index (Objective iii)</h3>
                <p className="text-xs text-slate-500">Measures safety hygiene. Higher percentages mean more students are SAFE in that category.</p>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                {filteredCount > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius={80} data={vulnerabilityRadarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} stroke="#475569" />
                      <Radar
                        name="Cohort Safety %"
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.15}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-500">No data matching active criteria</div>
                )}
              </div>
            </div>

            {/* Chart 2: Threat Attack Rates */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Incident Prevalence Correlation (Objective iii)</h3>
                <p className="text-xs text-slate-500">Percentage of filtered cohort who fell victim to cyberattacks</p>
              </div>
              <div className="h-64 w-full pt-4">
                {filteredCount > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={attackEncounterRates}
                      margin={{ top: 10, right: 10, left: 15, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 100]} unit="%" />
                      <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={120} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
                      <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                        {attackEncounterRates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center justify-center h-full">No data matching active criteria</div>
                )}
              </div>
            </div>

          </div>

          {/* Behavior vs. Literacy Scatterplot */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Bivariate Correlation: Cybersecurity Literacy vs. Safe Habits</h3>
              <p className="text-xs text-slate-500">Plot of student records. Identifies gaps where high general knowledge (X-axis) fails to translate to safe device habits (Y-axis).</p>
            </div>
            <div className="h-72 w-full">
              {filteredCount > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" dataKey="x" name="Awareness Literacy" unit="%" stroke="#64748b" fontSize={10} domain={[0, 100]} />
                    <YAxis type="number" dataKey="y" name="Safety Habits Score" unit="%" stroke="#64748b" fontSize={10} domain={[0, 100]} />
                    <ZAxis type="number" dataKey="risk" range={[40, 200]} name="Calculated Risk Level" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                      itemStyle={{ fontSize: "11px", color: "#ffffff" }}
                    />
                    <Scatter name="Students" data={scatterData} fill="#ef4444" fillOpacity={0.65} />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500 flex items-center justify-center h-full">No data matching active criteria</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: Analytics Simulator */}
      {activeSubTab === "simulator" && (
        <div className="space-y-6 animate-fadeIn" id="analytics-simulator-content">
          
          {/* Controls Panel */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-emerald-400" /> NOC Telemetry Analysis Board (Objective ii)
                </h3>
                <p className="text-xs text-slate-500">Simulates real-time packet & auth logging. Engaging Rules parses telemetry to stop attacks.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    isPlaying 
                      ? "bg-amber-950/40 text-amber-400 border border-amber-900/40 hover:bg-amber-950" 
                      : "bg-emerald-960 text-emerald-400 border border-emerald-900 hover:bg-emerald-950"
                  }`}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "Pause Stream" : "Engage Stream"}
                </button>
                
                <button 
                  onClick={handleClearSimulator}
                  className="p-2 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="h-4 w-4" /> Clear Logs
                </button>

                <button 
                  onClick={triggerSimulatedAttack}
                  className="p-2 bg-red-950 text-red-400 hover:text-red-300 hover:bg-red-900 border border-red-900/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition animate-pulse"
                >
                  <Zap className="h-4 w-4" /> Inject Brute Force Attack
                </button>
              </div>
            </div>

            {/* Live Analytics Dashboard Meter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-850">
              <div className="bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-center">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Total Streams Analyzed</span>
                <span className="text-xl font-black text-white font-mono">{stats.scanned}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-center">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Engaged Threat Rules</span>
                <span className="text-xl font-black text-sky-400 font-mono">{rules.filter(r => r.enabled).length} / {rules.length}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-center">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Suspicious Alerts Flagged</span>
                <span className="text-xl font-black text-amber-400 font-mono">{stats.alerts}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-center">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Active Intrusions Intercepted</span>
                <span className="text-xl font-black text-red-400 font-mono">{stats.blocked}</span>
              </div>
            </div>

          </div>

          {/* Rules Configuration & Live Logs Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rule Config Console */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 lg:col-span-1">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Analytics Threat Filters</h3>
                <p className="text-[10px] text-slate-500">Toggle rules to activate matching real-time log inspection filters.</p>
              </div>

              <div className="space-y-3 pt-2">
                {rules.map((rule) => (
                  <div 
                    key={rule.id} 
                    className={`rounded-lg p-3 border transition cursor-pointer ${
                      rule.enabled 
                        ? "bg-slate-950/80 border-emerald-900/60" 
                        : "bg-slate-950/20 border-slate-850 opacity-50"
                    }`}
                    onClick={() => toggleRule(rule.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={rule.enabled}
                          onChange={() => {}} // toggled on div click
                          className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900 pointer-events-none"
                        />
                        <span className="text-xs font-bold text-slate-200">{rule.name}</span>
                      </div>
                      <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase ${
                        rule.severity === "critical" 
                          ? "bg-red-950/60 text-red-400 border border-red-900/30" 
                          : rule.severity === "high"
                            ? "bg-amber-950/60 text-amber-400 border border-amber-900/30"
                            : "bg-blue-950/60 text-blue-400 border border-blue-900/30"
                      }`}>
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{rule.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Logger Stream */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Network Telemetry Console</h3>
                  <p className="text-[10px] text-slate-500">Real-time log buffer showing active rule intercepts</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block h-2 w-2 rounded-full bg-emerald-500 ${isPlaying ? "animate-ping" : ""}`} />
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{isPlaying ? "STREAMING" : "PAUSED"}</span>
                </div>
              </div>

              {/* Logs display shell */}
              <div className="h-[400px] rounded-lg bg-slate-950 border border-slate-850 p-4 font-mono text-xs overflow-y-auto space-y-3.5 scrollbar-thin">
                {processedLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                    <Database className="h-8 w-8 text-slate-850 animate-pulse" />
                    <span>Awaiting log feed connection. Click 'Engage Stream' to load logs...</span>
                  </div>
                ) : (
                  processedLogs.map((log) => {
                    let textClass = "text-slate-300";
                    let prefix = "[INFO]";
                    let statusBg = "bg-slate-900 text-slate-400 border-slate-800";

                    if (log.status === "blocked") {
                      textClass = "text-red-300";
                      prefix = "[BLOCKED / IPS INTERCEPT]";
                      statusBg = "bg-red-950/60 text-red-400 border-red-900/30";
                    } else if (log.status === "flagged" || log.status === "warning") {
                      textClass = "text-amber-300";
                      prefix = "[ALERT / THREAT INSIGHT]";
                      statusBg = "bg-amber-950/60 text-amber-400 border-amber-900/30";
                    }

                    return (
                      <div key={log.id} className="border-b border-slate-900 pb-3 space-y-1 bg-slate-950/40 p-2.5 rounded-md hover:bg-slate-900/20 transition">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold">{log.timestamp}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusBg}`}>{log.status.toUpperCase()}</span>
                            <span className="text-[10px] text-sky-400 font-bold font-sans">{log.university.split(" (")[0]}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Node IP: {log.ipAddress}</span>
                        </div>
                        
                        <div className="text-[11px] font-bold text-slate-200 mt-1">
                          {log.action} on service <span className="text-emerald-400 font-sans">{log.service}</span> via <span className="text-purple-400 font-sans">{log.deviceType}</span>
                        </div>
                        
                        <p className={`text-[10px] leading-relaxed italic ${textClass} bg-slate-950 p-2 rounded border border-slate-900/40 mt-1`}>
                          {prefix} {log.details}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* NOC Analysis Insight */}
              <p className="text-[10px] text-slate-500 italic leading-relaxed pt-2">
                *How to read this:* Enable or disable threat rules on the left to watch how incoming log packets are dynamically evaluated. Disabling "Weak Password Protection" allows simple dictionary auths to complete, whereas enabling it immediately quarantines the connection state.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
