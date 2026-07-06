import { StudentResponse, University, Gender, AcademicLevel, NetworkLog, AnalyticsRule } from "../types";

// Helper to get random item from array
const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate correlated boolean based on conditions
const weightedBool = (probability: number): boolean => Math.random() < probability;

// High-quality generation function representing actual cyber risks
export function generateMockStudentData(): StudentResponse[] {
  const universities = Object.values(University);
  const levels = Object.values(AcademicLevel);
  const genders = Object.values(Gender);

  const list: StudentResponse[] = [];

  // Let's seed 180 highly realistic records with correlated risks
  for (let i = 1; i <= 220; i++) {
    const university = pickRandom(universities);
    const gender = pickRandom(genders);
    const level = pickRandom(levels);

    // Baseline awareness factors
    const isTechSavvy = university === University.COVENANT || university === University.FUTA || Math.random() < 0.45;
    const isSenior = level === AcademicLevel.LEVEL_400 || level === AcademicLevel.LEVEL_500;

    // Objective i: Cybersecurity Knowledge / Awareness
    const knowsPhishing = weightedBool(isTechSavvy ? 0.85 : isSenior ? 0.70 : 0.45);
    const knowsTwoFactor = weightedBool(isTechSavvy ? 0.90 : isSenior ? 0.75 : 0.55);
    const knowsRansomware = weightedBool(isTechSavvy ? 0.65 : isSenior ? 0.50 : 0.30);
    const knowsDataPrivacyLaw = weightedBool(isTechSavvy ? 0.50 : isSenior ? 0.40 : 0.20); // Nigerian NDPR awareness is lower in general

    // Password Management
    const usePasswordManager = weightedBool(isTechSavvy ? 0.40 : 0.15);
    const passwordStrength = (usePasswordManager 
      ? "strong" 
      : pickRandom(isTechSavvy ? ["strong", "medium", "weak"] : ["medium", "weak", "weak"])) as "weak" | "medium" | "strong";
    
    // High-risk behaviors
    const passwordReuse = weightedBool(passwordStrength === "weak" ? 0.90 : 0.55);
    const passwordSharing = weightedBool(isTechSavvy ? 0.20 : 0.45);

    // Objective iv: Online Behavior & Device Usage
    const usePublicWifiNoVPN = weightedBool(university === University.UNILAG || university === University.UI ? 0.65 : 0.45);
    const softwareUpdateFrequency = pickRandom(["immediately", "delayed", "never"]) as "immediately" | "delayed" | "never";
    const clicksEmailLinks = pickRandom(isTechSavvy ? ["sometimes", "never"] : ["often", "sometimes", "never"]) as "often" | "sometimes" | "never";
    const sharesDevicesNoPasscode = weightedBool(0.30);

    // Causal risk variables for outcomes
    // Risk triggers:
    // 1. Weak/reused passwords or shared passwords -> Hacked/Unauthorized Access
    // 2. Public Wi-Fi no VPN or clicked email links or never update -> Phishing & Malware
    // 3. Low awareness -> Financial scam losses (Yahoo scams)
    
    let hackedProb = 0.05;
    if (passwordReuse) hackedProb += 0.20;
    if (passwordSharing) hackedProb += 0.15;
    if (passwordStrength === "weak") hackedProb += 0.20;
    const hadUnauthorizedAccess = weightedBool(Math.min(hackedProb, 0.85));

    let malwareProb = 0.08;
    if (usePublicWifiNoVPN) malwareProb += 0.25;
    if (softwareUpdateFrequency === "never") malwareProb += 0.15;
    if (clicksEmailLinks === "often") malwareProb += 0.30;
    const hadMalwareInfection = weightedBool(Math.min(malwareProb, 0.85));

    let phishingProb = 0.15;
    if (clicksEmailLinks === "often") phishingProb += 0.45;
    if (clicksEmailLinks === "sometimes") phishingProb += 0.20;
    if (!knowsPhishing) phishingProb += 0.20;
    const hadPhishingEncounter = weightedBool(Math.min(phishingProb, 0.90));

    let financialScamProb = 0.05;
    if (!knowsPhishing) financialScamProb += 0.25;
    if (clicksEmailLinks === "often") financialScamProb += 0.20;
    if (passwordSharing) financialScamProb += 0.15;
    const lostMoneyToScam = weightedBool(Math.min(financialScamProb, 0.70));

    // Objective iii: Calculate scoring metrics
    // Awareness score: 0 to 100
    let awarenessPoints = 0;
    if (knowsPhishing) awarenessPoints += 30;
    if (knowsTwoFactor) awarenessPoints += 30;
    if (knowsRansomware) awarenessPoints += 20;
    if (knowsDataPrivacyLaw) awarenessPoints += 20;
    const awarenessScore = awarenessPoints;

    // Behavior score: 0 to 100 (high is safe)
    let behaviorPoints = 100;
    if (passwordReuse) behaviorPoints -= 20;
    if (passwordSharing) behaviorPoints -= 15;
    if (passwordStrength === "weak") behaviorPoints -= 15;
    if (usePublicWifiNoVPN) behaviorPoints -= 20;
    if (clicksEmailLinks === "often") behaviorPoints -= 20;
    if (clicksEmailLinks === "sometimes") behaviorPoints -= 10;
    if (sharesDevicesNoPasscode) behaviorPoints -= 10;
    if (softwareUpdateFrequency === "never") behaviorPoints -= 10;
    if (softwareUpdateFrequency === "delayed") behaviorPoints -= 5;
    const behaviorScore = Math.max(10, behaviorPoints);

    // Risk score: 0 to 100 (high is risky, inverse of safe behaviors and adds exposure markers)
    let riskPoints = 0;
    riskPoints += (100 - behaviorScore) * 0.7;
    riskPoints += (100 - awarenessScore) * 0.3;
    if (hadUnauthorizedAccess) riskPoints += 10;
    if (hadMalwareInfection) riskPoints += 10;
    if (hadPhishingEncounter) riskPoints += 5;
    if (lostMoneyToScam) riskPoints += 15;
    const riskScore = Math.round(Math.min(100, Math.max(0, riskPoints)));

    const daysAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    list.push({
      id: `std-${i}`,
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
      timestamp
    });
  }

  return list;
}

// Generate realistic live logs for demonstrating Objective ii and iii
export function generateNetworkLogs(students: StudentResponse[]): NetworkLog[] {
  const actions = [
    { service: "EduPortal", action: "User Login", details: "Successful authentication from campus IP", status: "success", prob: 0.5 },
    { service: "VLE", action: "Course Material Access", details: "Accessed 'CSC 401: Distributed Systems'", status: "success", prob: 0.2 },
    { service: "PublicWifi", action: "External Network Handshake", details: "Connecting to open cafeteria Wi-Fi", status: "warning", prob: 0.1 },
    { service: "HostelWifi", action: "Port Scan Detected", details: "Inbound SSH port scan blocked by perimeter firewall", status: "blocked", prob: 0.05 },
    { service: "EduPortal", action: "Brute Force Warning", details: "Multiple failed authentication attempts", status: "flagged", prob: 0.05 },
    { service: "PersonalDevice", action: "Malicious Connection Blocked", details: "Blocked access to known command-and-control server", status: "blocked", prob: 0.05 },
    { service: "PublicWifi", action: "Credentials Exposure Risk", details: "Unencrypted HTTP POST transmission intercepted", status: "flagged", prob: 0.05 }
  ];

  const devices = ["Mobile", "Laptop", "Tablet"];
  const ipPrefixes = ["192.168.43.", "10.12.150.", "172.16.20.", "41.190.2.", "105.112.5."];
  const passwordsList = ["unilag123", "password", "godisgood", "jesus", "love1234", "qwerty", "david2005", "student_portal"];

  const logs: NetworkLog[] = [];
  const selectedStudents = students.slice(0, 30); // Pick 30 students to have log traces

  for (let i = 1; i <= 60; i++) {
    const student = pickRandom(selectedStudents);
    const actionConfig = pickRandom(actions);
    const device = pickRandom(devices) as "Mobile" | "Laptop" | "Tablet";
    const ip = `${pickRandom(ipPrefixes)}${Math.floor(Math.random() * 254) + 1}`;
    
    const minutesAgo = i * 12 + Math.floor(Math.random() * 10);
    const logTime = new Date(Date.now() - minutesAgo * 60000).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Make the logs correspond to the student's actual behaviors
    let finalStatus = actionConfig.status as "success" | "warning" | "blocked" | "flagged";
    let finalDetails = actionConfig.details;
    const isPublic = actionConfig.service === "PublicWifi";
    const hasVPN = !student.usePublicWifiNoVPN && Math.random() < 0.8;

    if (isPublic && student.usePublicWifiNoVPN && !hasVPN) {
      finalStatus = "flagged";
      finalDetails = "Unsecured connection to Cafeteria Wi-Fi without active encryption/VPN";
    }

    let passwordAttempt = "";
    if (actionConfig.action === "Brute Force Warning" || Math.random() < 0.15) {
      passwordAttempt = student.passwordStrength === "weak" ? pickRandom(passwordsList) : "•••••••••••••";
      if (student.passwordStrength === "weak") {
        finalStatus = "warning";
        finalDetails = `Weak credentials submitted: "${passwordAttempt}" (Detected as unsafe practice)`;
      }
    }

    logs.push({
      id: `log-${1000 + i}`,
      timestamp: logTime,
      studentId: student.id,
      university: student.university,
      ipAddress: ip,
      action: actionConfig.action,
      service: actionConfig.service as any,
      status: finalStatus,
      details: finalDetails,
      deviceType: device,
      isPublicWifi: isPublic,
      hasVPN,
      passwordAttempt
    });
  }

  return logs;
}

export const defaultRules: AnalyticsRule[] = [
  {
    id: "rule-1",
    name: "Weak Password Protection",
    description: "Scan connections and authenticate request fields to flag dictionary passwords or keys under 8 characters.",
    enabled: true,
    severity: "high",
    conditionType: "weak_password_usage"
  },
  {
    id: "rule-2",
    name: "Insecure Public Wi-Fi Handshake",
    description: "Inspect Wi-Fi packets and flag any educational portal logins on public access networks with missing VPN tunnels.",
    enabled: true,
    severity: "medium",
    conditionType: "public_wifi_no_vpn"
  },
  {
    id: "rule-3",
    name: "Credential Stuffing & Brute Force",
    description: "Correlate server login attempts and flag nodes with >3 failed authentication packets within 2 minutes.",
    enabled: true,
    severity: "critical",
    conditionType: "multiple_failures"
  },
  {
    id: "rule-4",
    name: "Phishing Link Access Detector",
    description: "Trace outbound HTTP request URLs against verified global/NDR blacklist domains to intercept social engineering setups.",
    enabled: true,
    severity: "critical",
    conditionType: "unsafe_links"
  }
];
