export enum University {
  UNILAG = "University of Lagos (UNILAG)",
  UI = "University of Ibadan (UI)",
  OAU = "Obafemi Awolowo University (OAU)",
  ABU = "Ahmadu Bello University (ABU)",
  UNN = "University of Nigeria, Nsukka (UNN)",
  FUTA = "Federal University of Technology, Akure (FUTA)",
  COVENANT = "Covenant University",
  OTHER = "Other Nigerian University"
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other / Prefer not to say"
}

export enum AcademicLevel {
  LEVEL_100 = "100 Level",
  LEVEL_200 = "200 Level",
  LEVEL_300 = "300 Level",
  LEVEL_400 = "400 Level",
  LEVEL_500 = "500 Level / Postgrad"
}

export interface StudentResponse {
  id: string;
  university: University;
  gender: Gender;
  level: AcademicLevel;
  
  // Cybersecurity Knowledge (Objective i)
  knowsPhishing: boolean;
  knowsTwoFactor: boolean;
  knowsRansomware: boolean;
  knowsDataPrivacyLaw: boolean; // e.g. NDPR (Nigeria Data Protection Regulation)
  
  // Password Management (Objective i)
  passwordStrength: "weak" | "medium" | "strong";
  passwordReuse: boolean; // Reuses passwords across sites
  passwordSharing: boolean; // Has shared passwords with friends
  usePasswordManager: boolean;
  
  // Online Behavior & Device Usage (Objective iv)
  usePublicWifiNoVPN: boolean;
  softwareUpdateFrequency: "immediately" | "delayed" | "never";
  clicksEmailLinks: "often" | "sometimes" | "never";
  sharesDevicesNoPasscode: boolean;
  
  // Previous Cyberattack Experiences (Objective iv)
  hadPhishingEncounter: boolean;
  hadMalwareInfection: boolean;
  hadUnauthorizedAccess: boolean; // Social media/bank account hacked
  lostMoneyToScam: boolean; // Financial loss to Yahoo/scam formats
  
  // Scoring / Analytics Meta (Objective iii)
  riskScore: number; // 0 (Low) to 100 (Critical)
  awarenessScore: number; // 0 (Low) to 100 (Excellent)
  behaviorScore: number; // 0 (Risky) to 100 (Excellent)
  timestamp: string;
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  studentId: string;
  university: University;
  ipAddress: string;
  action: string;
  service: "EduPortal" | "PublicWifi" | "HostelWifi" | "VLE" | "PersonalDevice";
  status: "success" | "warning" | "blocked" | "flagged";
  details: string;
  deviceType: "Mobile" | "Laptop" | "Tablet" | "Unknown";
  isPublicWifi: boolean;
  hasVPN: boolean;
  passwordAttempt: string;
}

export interface AnalyticsRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  conditionType: "multiple_failures" | "public_wifi_no_vpn" | "unsafe_links" | "weak_password_usage";
}
