import React, { useState } from "react";
import { StudentResponse, University, Gender, AcademicLevel } from "../types";
import { 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Key, 
  Wifi, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Sparkles,
  Lock,
  Globe,
  Info
} from "lucide-react";

interface Props {
  onAddResponse: (response: StudentResponse) => void;
  onNavigateToAI: (studentProfile: any) => void;
}

export default function StudentSurvey({ onAddResponse, onNavigateToAI }: Props) {
  // Survey steps: 
  // 1. Demographics
  // 2. Knowledge & Password Hygiene
  // 3. Online Behaviors & Devices
  // 4. Attack Experiences
  // 5. Results Report
  const [step, setStep] = useState<number>(1);

  // Form State
  const [university, setUniversity] = useState<University>(University.UNILAG);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [level, setLevel] = useState<AcademicLevel>(AcademicLevel.LEVEL_100);

  // Objective i state
  const [knowsPhishing, setKnowsPhishing] = useState<boolean>(false);
  const [knowsTwoFactor, setKnowsTwoFactor] = useState<boolean>(false);
  const [knowsRansomware, setKnowsRansomware] = useState<boolean>(false);
  const [knowsDataPrivacyLaw, setKnowsDataPrivacyLaw] = useState<boolean>(false);

  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("medium");
  const [passwordReuse, setPasswordReuse] = useState<boolean>(false);
  const [passwordSharing, setPasswordSharing] = useState<boolean>(false);
  const [usePasswordManager, setUsePasswordManager] = useState<boolean>(false);

  // Objective iv state
  const [usePublicWifiNoVPN, setUsePublicWifiNoVPN] = useState<boolean>(false);
  const [softwareUpdateFrequency, setSoftwareUpdateFrequency] = useState<"immediately" | "delayed" | "never">("delayed");
  const [clicksEmailLinks, setClicksEmailLinks] = useState<"often" | "sometimes" | "never">("sometimes");
  const [sharesDevicesNoPasscode, setSharesDevicesNoPasscode] = useState<boolean>(false);

  const [hadPhishingEncounter, setHadPhishingEncounter] = useState<boolean>(false);
  const [hadMalwareInfection, setHadMalwareInfection] = useState<boolean>(false);
  const [hadUnauthorizedAccess, setHadUnauthorizedAccess] = useState<boolean>(false);
  const [lostMoneyToScam, setLostMoneyToScam] = useState<boolean>(false);

  // Calculated Result State
  const [calculatedResult, setCalculatedResult] = useState<StudentResponse | null>(null);

  // Scoring engine
  const handleCalculateScore = () => {
    // 1. Awareness Score (0 - 100)
    let awarenessPoints = 0;
    if (knowsPhishing) awarenessPoints += 30;
    if (knowsTwoFactor) awarenessPoints += 30;
    if (knowsRansomware) awarenessPoints += 20;
    if (knowsDataPrivacyLaw) awarenessPoints += 20;
    const awarenessScore = awarenessPoints;

    // 2. Behavior Safety Score (0 - 100, high is safe)
    let behaviorPoints = 100;
    if (passwordReuse) behaviorPoints -= 20;
    if (passwordSharing) behaviorPoints -= 15;
    if (passwordStrength === "weak") behaviorPoints -= 15;
    if (passwordStrength === "medium") behaviorPoints -= 5;
    if (usePublicWifiNoVPN) behaviorPoints -= 20;
    if (clicksEmailLinks === "often") behaviorPoints -= 20;
    if (clicksEmailLinks === "sometimes") behaviorPoints -= 10;
    if (sharesDevicesNoPasscode) behaviorPoints -= 10;
    if (softwareUpdateFrequency === "never") behaviorPoints -= 10;
    if (softwareUpdateFrequency === "delayed") behaviorPoints -= 5;
    const behaviorScore = Math.max(10, behaviorPoints);

    // 3. Risk Score (0 - 100, high is risky)
    let riskPoints = 0;
    riskPoints += (100 - behaviorScore) * 0.7;
    riskPoints += (100 - awarenessScore) * 0.3;
    
    // Attack experience impact
    if (hadUnauthorizedAccess) riskPoints += 10;
    if (hadMalwareInfection) riskPoints += 10;
    if (hadPhishingEncounter) riskPoints += 5;
    if (lostMoneyToScam) riskPoints += 15;
    const riskScore = Math.round(Math.min(100, Math.max(0, riskPoints)));

    const result: StudentResponse = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      university,
      gender,
      level,
      knowsPhishing,
      knowsTwoFactor,
      knowsRansomware,
      knowsDataPrivacyLaw,
      passwordStrength,
      passwordReuse,
      passwordSharing,
      usePasswordManager,
      usePublicWifiNoVPN,
      softwareUpdateFrequency,
      clicksEmailLinks,
      sharesDevicesNoPasscode,
      hadPhishingEncounter,
      hadMalwareInfection,
      hadUnauthorizedAccess,
      lostMoneyToScam,
      riskScore,
      awarenessScore,
      behaviorScore,
      timestamp: new Date().toISOString().split('T')[0]
    };

    setCalculatedResult(result);
    onAddResponse(result);
    setStep(5);
  };

  const handleReset = () => {
    setStep(1);
    setCalculatedResult(null);
    setKnowsPhishing(false);
    setKnowsTwoFactor(false);
    setKnowsRansomware(false);
    setKnowsDataPrivacyLaw(false);
    setPasswordStrength("medium");
    setPasswordReuse(false);
    setPasswordSharing(false);
    setUsePasswordManager(false);
    setUsePublicWifiNoVPN(false);
    setSoftwareUpdateFrequency("delayed");
    setClicksEmailLinks("sometimes");
    setSharesDevicesNoPasscode(false);
    setHadPhishingEncounter(false);
    setHadMalwareInfection(false);
    setHadUnauthorizedAccess(false);
    setLostMoneyToScam(false);
  };

  const getRiskLevelColor = (score: number) => {
    if (score < 35) return "text-emerald-400 bg-emerald-950/40 border-emerald-500/20";
    if (score < 70) return "text-amber-400 bg-amber-950/40 border-amber-500/20";
    return "text-red-400 bg-red-950/40 border-red-500/20";
  };

  const getRiskLabel = (score: number) => {
    if (score < 35) return "Secure / Low Risk";
    if (score < 70) return "Moderate Threat Exposure";
    return "Critical Susceptibility / Extreme Risk";
  };

  return (
    <div className="max-w-3xl mx-auto rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl" id="student-survey-root">
      
      {/* Header */}
      <div className="border-b border-slate-850 pb-5 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-emerald-400" />
          Cybersecurity Diagnostic & Risk Audit
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Complete this diagnostic tool to calculate your personal Vulnerability Index and test your knowledge against Nigeria university student benchmarks.
        </p>
      </div>

      {/* Progress Tracker */}
      {step < 5 && (
        <div className="flex items-center justify-between mb-8">
          {[
            { n: 1, label: "Profile" },
            { n: 2, label: "Awareness & Keys" },
            { n: 3, label: "Behavior" },
            { n: 4, label: "Encounters" }
          ].map((s) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold font-mono transition duration-200 ${
                  step === s.n 
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/10" 
                    : step > s.n 
                      ? "bg-slate-800 border-slate-700 text-emerald-400" 
                      : "bg-slate-950 border-slate-800 text-slate-500"
                }`}>
                  {s.n}
                </span>
                <span className={`text-[10px] font-medium hidden sm:inline ${step === s.n ? "text-slate-200" : "text-slate-500"}`}>
                  {s.label}
                </span>
              </div>
              {s.n < 4 && (
                <div className={`h-[1px] flex-1 border-t transition duration-200 ${step > s.n ? "border-emerald-700" : "border-slate-800"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* STEP 1: Academic Demographics */}
      {step === 1 && (
        <div className="space-y-6" id="survey-step-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" /> Academic & Demographic Profile
          </h3>

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">University Affiliation</label>
              <select 
                value={university}
                onChange={(e) => setUniversity(e.target.value as University)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                {Object.values(University).map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">Matches institutional profiles analyzed in this study</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Current Academic Level</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.values(AcademicLevel).map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Gender Identity</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.values(Gender).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              id="survey-next-1"
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition duration-200"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Cybersecurity Awareness & Passwords */}
      {step === 2 && (
        <div className="space-y-6" id="survey-step-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" /> Cyber Awareness & Password Hygiene (Objective i)
            </h3>
            <span className="text-[10px] text-slate-500">Awareness & Keys</span>
          </div>

          {/* Core Awareness Checklist */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Which of the following cybersecurity terms are you familiar with?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-700 transition">
                <input 
                  type="checkbox" 
                  checked={knowsPhishing}
                  onChange={(e) => setKnowsPhishing(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-200">Phishing Attacks</span>
                  <span className="block text-[10px] text-slate-500">Scam emails/links designed to harvest logins or money.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-700 transition">
                <input 
                  type="checkbox" 
                  checked={knowsTwoFactor}
                  onChange={(e) => setKnowsTwoFactor(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-200">Two-Factor Auth (2FA / MFA)</span>
                  <span className="block text-[10px] text-slate-500">An extra verification code on top of standard password.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-700 transition">
                <input 
                  type="checkbox" 
                  checked={knowsRansomware}
                  onChange={(e) => setKnowsRansomware(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-200">Ransomware</span>
                  <span className="block text-[10px] text-slate-500">Malware that locks user files and demands payment to release.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-700 transition">
                <input 
                  type="checkbox" 
                  checked={knowsDataPrivacyLaw}
                  onChange={(e) => setKnowsDataPrivacyLaw(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-200">Data Privacy Regulation</span>
                  <span className="block text-[10px] text-slate-500">Familiarity with NDPR (Nigeria Data Protection Regulation).</span>
                </div>
              </label>
            </div>
          </div>

          {/* Password Hygiene */}
          <div className="space-y-4 pt-2 border-t border-slate-850">
            <h4 className="text-xs font-bold text-slate-300">Password Management & Safety Metrics</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-400">Password Strength Rating</label>
                <select 
                  value={passwordStrength}
                  onChange={(e) => setPasswordStrength(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="weak">Weak (e.g. name123, short, only words)</option>
                  <option value="medium">Medium (e.g. mixture of letters and numbers)</option>
                  <option value="strong">Strong (e.g. symbols, mixed cases, 12+ characters)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-400">Password Manager Usage</label>
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="chk-pm"
                    checked={usePasswordManager}
                    onChange={(e) => setUsePasswordManager(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                  />
                  <label htmlFor="chk-pm" className="text-xs text-slate-300">I use a Password Manager (e.g., Google, Bitwarden)</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/20 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={passwordReuse}
                  onChange={(e) => setPasswordReuse(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-300">Credential Reuse</span>
                  <span className="block text-[10px] text-slate-500">I reuse the same password across multiple online accounts (email, banking, school).</span>
                </div>
              </label>

              <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/20 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={passwordSharing}
                  onChange={(e) => setPasswordSharing(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-300">Credential Sharing</span>
                  <span className="block text-[10px] text-slate-500">I have shared my school/personal account passwords with close friends or classmates.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-between border-t border-slate-850">
            <button 
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Back
            </button>
            <button 
              id="survey-next-2"
              onClick={() => setStep(3)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Online Behavior & Device Usage */}
      {step === 3 && (
        <div className="space-y-6" id="survey-step-3">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Wifi className="h-4 w-4 text-emerald-400" /> Device Usage & Network Behavior (Objective iv)
            </h3>
            <span className="text-[10px] text-slate-500">Online Behavior</span>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Public Wi-Fi Connectivity</label>
              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-750 transition">
                <input 
                  type="checkbox" 
                  checked={usePublicWifiNoVPN}
                  onChange={(e) => setUsePublicWifiNoVPN(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-200">I connect to Campus or Cafeteria Free Wi-Fi without using a VPN</span>
                  <span className="block text-[10px] text-slate-500">Unencrypted public Wi-Fi leaves your web session tokens exposed to packet sniffing and man-in-the-middle attacks.</span>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Clicking Links in Unverified Emails/SMS</label>
                <select 
                  value={clicksEmailLinks}
                  onChange={(e) => setClicksEmailLinks(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="never">Never (I scrutinize every sender and domain)</option>
                  <option value="sometimes">Sometimes (If it looks urgent or school-related)</option>
                  <option value="often">Often (I click to verify immediately without checking domain)</option>
                </select>
                <p className="text-[9px] text-slate-500">Primary delivery vector for university phishing campaigns</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Software & Security Updates</label>
                <select 
                  value={softwareUpdateFrequency}
                  onChange={(e) => setSoftwareUpdateFrequency(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="immediately">Immediately (As soon as updates are published)</option>
                  <option value="delayed">Delayed (I wait weeks or prompt to 'remind me later')</option>
                  <option value="never">Never / Ignore (I rarely update my devices)</option>
                </select>
                <p className="text-[9px] text-slate-500">Critical for patching zero-day exploits used in malware</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-850">
              <label className="block text-xs font-semibold text-slate-300">Device Physical Access Sharing</label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/20 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sharesDevicesNoPasscode}
                  onChange={(e) => setSharesDevicesNoPasscode(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-300">Shared Unlocked Devices</span>
                  <span className="block text-[10px] text-slate-500">I share my phone or laptop with friends without a lock code active, or leave them unattended in class.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-between border-t border-slate-850">
            <button 
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Back
            </button>
            <button 
              id="survey-next-3"
              onClick={() => setStep(4)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Cyberattack Encounters */}
      {step === 4 && (
        <div className="space-y-6" id="survey-step-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-emerald-400" /> Historic Threat Incidents (Objective iv)
            </h3>
            <span className="text-[10px] text-slate-500">Cyberattack Encounters</span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Please disclose any experiences you have had with cyberattacks in the past. This data helps establish correlation patterns between online behaviors and successful attacks (Objective iii).
          </p>

          <div className="grid grid-cols-1 gap-4">
            <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-750 transition">
              <input 
                type="checkbox" 
                checked={hadPhishingEncounter}
                onChange={(e) => setHadPhishingEncounter(e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
              />
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-slate-200">Phishing Exposure</span>
                <span className="block text-[11px] text-slate-500">I have received or clicked an email, SMS, or WhatsApp message pretending to be my school portal, bank, or a lottery, trying to steal my credentials.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-750 transition">
              <input 
                type="checkbox" 
                checked={hadMalwareInfection}
                onChange={(e) => setHadMalwareInfection(e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
              />
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-slate-200">Malware / Virus Compromise</span>
                <span className="block text-[11px] text-slate-500">My device has been infected with a virus, Trojan, or adware that slowed it down or stole local files, often from downloading peer-to-peer files.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-750 transition">
              <input 
                type="checkbox" 
                checked={hadUnauthorizedAccess}
                onChange={(e) => setHadUnauthorizedAccess(e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
              />
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-slate-200">Unauthorized Account Access (Hacked)</span>
                <span className="block text-[11px] text-slate-500">One of my active social media accounts (Instagram, WhatsApp), email, or school portal was accessed or locked out by someone else.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-750 transition">
              <input 
                type="checkbox" 
                checked={lostMoneyToScam}
                onChange={(e) => setLostMoneyToScam(e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-900"
              />
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-slate-200">Financial Loss to Online Fraud / Yahoo Scams</span>
                <span className="block text-[11px] text-slate-500">I or a direct family member have lost funds due to internet scams, fake bank transfers, fake investment platforms, or mobile money fraud.</span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-between border-t border-slate-850">
            <button 
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Back
            </button>
            <button 
              id="survey-submit"
              onClick={handleCalculateScore}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition"
            >
              <ShieldCheck className="h-4 w-4" /> Analyze Risk Score
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Audit Result Report */}
      {step === 5 && calculatedResult && (
        <div className="space-y-6" id="survey-results">
          
          {/* Headline Score Header */}
          <div className="text-center space-y-2 p-6 rounded-xl bg-slate-950 border border-slate-800">
            <div className="inline-flex p-3 bg-slate-900 rounded-full mb-1 border border-slate-800">
              {calculatedResult.riskScore < 35 ? (
                <ShieldCheck className="h-10 w-10 text-emerald-400 animate-pulse" />
              ) : (
                <ShieldAlert className="h-10 w-10 text-red-400 animate-pulse" />
              )}
            </div>
            <h3 className="text-lg font-bold text-white">Your Security Diagnosis</h3>
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRiskLevelColor(calculatedResult.riskScore)}`}>
                {getRiskLabel(calculatedResult.riskScore)}
              </span>
            </div>
          </div>

          {/* Three Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Computed Risk Index</span>
              <div className="text-3xl font-black text-red-400 font-mono">{calculatedResult.riskScore}%</div>
              <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-500 h-1.5" style={{ width: `${calculatedResult.riskScore}%` }} />
              </div>
              <p className="text-[9px] text-slate-500">Lower is better. Measures susceptibility to hacks.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Awareness Score</span>
              <div className="text-3xl font-black text-sky-400 font-mono">{calculatedResult.awarenessScore}%</div>
              <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                <div className="bg-sky-400 h-1.5" style={{ width: `${calculatedResult.awarenessScore}%` }} />
              </div>
              <p className="text-[9px] text-slate-500">Higher is better. Measures terminology familiarity.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Behavior Hygiene Score</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">{calculatedResult.behaviorScore}%</div>
              <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5" style={{ width: `${calculatedResult.behaviorScore}%` }} />
              </div>
              <p className="text-[9px] text-slate-500">Higher is better. Measures password & device safety.</p>
            </div>

          </div>

          {/* Behavioral Vulnerability Audit */}
          <div className="rounded-xl border border-slate-800 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-emerald-400" /> Behavioral Vulnerability Breakdown
            </h4>
            
            <div className="space-y-3">
              {calculatedResult.passwordStrength === "weak" && (
                <div className="flex gap-2.5 text-xs text-amber-200 bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-400">Weak Portal Credentials:</strong>
                    Your current password practices are highly vulnerable to basic dictionary attacks. Credential harvesting scripts can easily guess weak passwords on school portals.
                  </div>
                </div>
              )}

              {calculatedResult.passwordReuse && (
                <div className="flex gap-2.5 text-xs text-red-200 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-400">Critical Credential Reuse Risk:</strong>
                    Reusing passwords means if an insecure website suffers a leak, hackers can access your email, student portals, and financial apps (Credential Stuffing).
                  </div>
                </div>
              )}

              {calculatedResult.usePublicWifiNoVPN && (
                <div className="flex gap-2.5 text-xs text-amber-200 bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-400">Exposed Network Session Traffic:</strong>
                    Connecting to cafeteria or campus Wi-Fi without active VPN tunnels allows session hijacking where hackers sniff local packets to clone your login states.
                  </div>
                </div>
              )}

              {calculatedResult.clicksEmailLinks === "often" && (
                <div className="flex gap-2.5 text-xs text-red-200 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-400">Extremely Vulnerable to Phishing:</strong>
                    Clicking unverified email links is the #1 vector for malware. Nigerian school platforms are frequently cloned to capture student credentials.
                  </div>
                </div>
              )}

              {calculatedResult.behaviorScore >= 80 && (
                <div className="flex gap-2.5 text-xs text-emerald-200 bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-400">Stellar Safety Hygiene:</strong>
                    Excellent job! You maintain high-level password strength, update software promptly, and isolate network traffic using encrypted VPN tunnels.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Advisor Promotion Box */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-800/40 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Unlock Personal AI Cybersecurity Audit</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Submit your diagnostic profile to the **Gemini AI Security Analyst** to generate a bespoke academic defense playbook, vulnerability remediation timeline, and detailed pattern report.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-1">
              <button 
                id="btn-trigger-ai-audit"
                onClick={() => onNavigateToAI(calculatedResult)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
              >
                <Sparkles className="h-3.5 w-3.5" /> Generate Deep AI Audit Report
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex justify-between border-t border-slate-850">
            <button 
              onClick={handleReset}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restart Audit
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
