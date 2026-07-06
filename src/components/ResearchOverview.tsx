import React from "react";
import { StudentResponse, University } from "../types";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Activity, 
  Lock, 
  HelpCircle,
  TrendingUp,
  Cpu,
  Target,
  Share2
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
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";

interface Props {
  responses: StudentResponse[];
  onNavigate: (tab: string) => void;
}

export default function ResearchOverview({ responses, onNavigate }: Props) {
  // Compute key statistics
  const totalStudents = responses.length;
  
  const criticalRiskCount = responses.filter(r => r.riskScore >= 70).length;
  const criticalPercentage = Math.round((criticalRiskCount / totalStudents) * 100);

  const averageAwareness = Math.round(responses.reduce((sum, r) => sum + r.awarenessScore, 0) / totalStudents);
  const averageBehavior = Math.round(responses.reduce((sum, r) => sum + r.behaviorScore, 0) / totalStudents);
  
  // Cyberattacks breakdown
  const phishingCount = responses.filter(r => r.hadPhishingEncounter).length;
  const malwareCount = responses.filter(r => r.hadMalwareInfection).length;
  const hackCount = responses.filter(r => r.hadUnauthorizedAccess).length;
  const scamCount = responses.filter(r => r.lostMoneyToScam).length;

  const attackData = [
    { name: "Phishing Links", count: phishingCount, percentage: Math.round((phishingCount / totalStudents) * 100), color: "#38bdf8" },
    { name: "Malware Attack", count: malwareCount, percentage: Math.round((malwareCount / totalStudents) * 100), color: "#fb923c" },
    { name: "Account Compromised", count: hackCount, percentage: Math.round((hackCount / totalStudents) * 100), color: "#f87171" },
    { name: "Financial Scam Loss", count: scamCount, percentage: Math.round((scamCount / totalStudents) * 100), color: "#c084fc" },
  ];

  // University comparison (aggregate data)
  const uniStats = Object.values(University).map(uni => {
    const uniResponses = responses.filter(r => r.university === uni);
    if (uniResponses.length === 0) return null;
    const avgRisk = Math.round(uniResponses.reduce((sum, r) => sum + r.riskScore, 0) / uniResponses.length);
    const avgAware = Math.round(uniResponses.reduce((sum, r) => sum + r.awarenessScore, 0) / uniResponses.length);
    const avgBehave = Math.round(uniResponses.reduce((sum, r) => sum + r.behaviorScore, 0) / uniResponses.length);
    // Shorten university names for chart label readability
    const shortName = uni.replace("University of ", "Univ. of ").replace("University", "Uni.").split(" (")[0];
    return { name: shortName, risk: avgRisk, awareness: avgAware, behavior: avgBehave };
  }).filter(Boolean);

  // Risk Score distribution groups
  const lowRisk = responses.filter(r => r.riskScore < 35).length;
  const mediumRisk = responses.filter(r => r.riskScore >= 35 && r.riskScore < 70).length;
  const highRisk = responses.filter(r => r.riskScore >= 70).length;

  const distributionData = [
    { name: "Low Risk (0-34)", value: lowRisk, color: "#10b981" },
    { name: "Moderate Risk (35-69)", value: mediumRisk, color: "#f59e0b" },
    { name: "High/Critical Risk (70-100)", value: highRisk, color: "#ef4444" }
  ];

  const objectives = [
    {
      id: "i",
      title: "Knowledge & Awareness Level",
      desc: "To study the existing knowledge and awareness levels of students concerning cybersecurity, password management, and data privacy.",
      status: `Average Score: ${averageAwareness}/100`,
      color: "border-sky-500/30 text-sky-400 bg-sky-950/20"
    },
    {
      id: "ii",
      title: "Role of Data Analytics",
      desc: "To examine the role of data analytics in detecting and preventing cyber crime among university students.",
      status: "Active Simulator Ready",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
    },
    {
      id: "iii",
      title: "Pattern & Weakness Analysis",
      desc: "To analyze the data using data analysis to identify major patterns, weaknesses, and unsafe practices.",
      status: `${totalStudents} Active Records Analyzed`,
      color: "border-purple-500/30 text-purple-400 bg-purple-950/20"
    },
    {
      id: "iv",
      title: "Online Behavior & Incident Tracking",
      desc: "To examine students’ online behavior, device usage, and previous experiences with cyberattacks.",
      status: `${Math.round(((phishingCount + malwareCount + hackCount + scamCount) / (totalStudents * 4)) * 100)}% Total Incident Density`,
      color: "border-orange-500/30 text-orange-400 bg-orange-950/20"
    }
  ];

  return (
    <div className="space-y-8" id="research-overview">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Shield className="h-3.5 w-3.5" /> Case Study: Nigeria
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            CYBER SECURITY AWARENESS & THE ROLE OF DATA ANALYTICS IN PREVENTING CYBERCRIME AMONG UNIVERSITY STUDENTS
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            This research explores the cybersecurity vulnerabilities, knowledge gaps, and online behavior of university students in Nigeria. It demonstrates how telemetry logs and real-time behavioral data analytics can be deployed to intercept attack vectors, secure institutional credentials, and mitigate financial fraud.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              id="btn-take-survey"
              onClick={() => onNavigate("survey")}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg hover:shadow-emerald-500/20 transition duration-200 flex items-center gap-2 text-sm"
            >
              <Activity className="h-4 w-4" /> Start Safety Survey
            </button>
            <button 
              id="btn-view-analytics"
              onClick={() => onNavigate("analytics")}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition duration-200 flex items-center gap-2 text-sm"
            >
              <Cpu className="h-4 w-4" /> Launch Analytics Engine
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Respondents</span>
            <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">{totalStudents}</h3>
            <p className="text-xs text-slate-500">Live academic records analyzed</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">High Risk Susceptibility</span>
            <div className="p-2 bg-red-950/30 rounded-lg text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-red-400">{criticalPercentage}%</h3>
            <p className="text-xs text-slate-500">Risk Score &ge; 70 (Vulnerable)</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Avg Awareness Index</span>
            <div className="p-2 bg-sky-950/30 rounded-lg text-sky-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-sky-400">{averageAwareness}%</h3>
            <p className="text-xs text-slate-500">Cybersecurity basic literacy</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Password/Network Hygiene</span>
            <div className="p-2 bg-purple-950/30 rounded-lg text-purple-400">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-purple-400">{averageBehavior}%</h3>
            <p className="text-xs text-slate-500">Device & hygiene safety score</p>
          </div>
        </div>
      </div>

      {/* Objectives Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Study Core Objectives</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectives.map((obj) => (
            <div 
              key={obj.id} 
              className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition duration-200 hover:scale-[1.01] ${obj.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold font-mono">
                    {obj.id.toUpperCase()}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">{obj.title}</h4>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{obj.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 text-xs font-medium font-mono">
                <span>Objective Metric:</span>
                <span className="opacity-90">{obj.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Findings Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Cyberattacks Encountered */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Student Cyberattack Incident Breakdown</h3>
              <p className="text-xs text-slate-500">Percentage of surveyed students who experienced these threats</p>
            </div>
            <Activity className="h-4 w-4 text-orange-400" />
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attackData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  unit="%" 
                  domain={[0, 100]}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {attackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Profile Distribution */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Risk Profile Categorization</h3>
            <p className="text-xs text-slate-500">Distribution of calculated susceptibility ratings</p>
          </div>
          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                  itemStyle={{ color: "#ffffff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="block text-2xl font-black text-white">{criticalPercentage}%</span>
              <span className="block text-[10px] uppercase tracking-wider text-red-400 font-bold">Vulnerable</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-800/40">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-white font-mono">
                  {item.value} ({Math.round((item.value / totalStudents) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Institutional Comparison */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Institutional Metric Comparison</h3>
            <p className="text-xs text-slate-500">Average metrics of university cohorts across Nigeria (Awareness vs. Safe Behavior vs. Risk)</p>
          </div>
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={uniStats}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                itemStyle={{ fontSize: "12px" }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="awareness" name="Security Awareness Score" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="behavior" name="Safety Behavior Score" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="risk" name="Overall Risk Level" fill="#f43f5e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytical Callout */}
      <div className="rounded-xl bg-slate-950 border border-emerald-900/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h4 className="text-emerald-400 font-bold flex items-center gap-2 text-sm sm:text-base">
            <Cpu className="h-5 w-5" /> How Data Analytics Prevents Cybercrime
          </h4>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            While awareness programs are essential, human-error factors remain high. Data analytics operates behind the scenes—correlating network logs, inspecting packet signatures, calculating user threat susceptibility indices, and automatically blacklisting malicious requests. This research demonstrates this real-time defense.
          </p>
        </div>
        <button 
          id="btn-explore-data-miners"
          onClick={() => onNavigate("analytics")}
          className="whitespace-nowrap px-4 py-2 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/50 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition duration-200"
        >
          Explore Data Miners &rarr;
        </button>
      </div>
    </div>
  );
}
