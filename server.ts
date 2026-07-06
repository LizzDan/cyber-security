import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize Gemini client (server-side only)
  // Note: key is injected as process.env.GEMINI_API_KEY
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. AI operations will return a fallback message.");
  }

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Gemini endpoint for custom Cybersecurity Advisories and Research Insights
  app.post("/api/ai-analysis", async (req, res) => {
    const { mode, profile, question } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: "Google Gemini API client is not configured on this server. Please set the GEMINI_API_KEY secret.",
        fallback: "This is a local analysis. Based on your answers, you have significant cyber vulnerabilities. Reusing passwords and connecting to public Wi-Fi without a VPN are unsafe practices prevalent among 65% of Nigerian university students. Consider using strong unique passwords, a premium VPN, and disabling automatic Wi-Fi connections."
      });
    }

    try {
      let prompt = "";
      let systemInstruction = "You are an expert Cybersecurity Research Analyst specializing in academic institutional security, Nigerian cybercrime trends (such as social engineering, phishing, and local transactional scam vectors), and predictive threat analytics. Keep your style highly professional, educational, academic, and deeply actionable. Format your output with clean, modern Markdown (headers, bullet points, bold text).";

      if (mode === "advisory") {
        const { university, level, scoreCard } = profile;
        prompt = `
You are analyzing a diagnostic cybersecurity survey of a Nigerian university student with the following profile:
- University: ${university}
- Academic Level: ${level}
- Awareness Score: ${scoreCard.awarenessScore}/100
- Behavior/Safety Score: ${scoreCard.behaviorScore}/100
- Computed Risk Score: ${scoreCard.riskScore}/100

Detailed Student Behaviors & Exposure:
- Knowledge of Phishing: ${scoreCard.knowsPhishing ? "Yes" : "No"}
- Knowledge of 2FA: ${scoreCard.knowsTwoFactor ? "Yes" : "No"}
- Knowledge of Ransomware: ${scoreCard.knowsRansomware ? "Yes" : "No"}
- Password Strength: ${scoreCard.passwordStrength}
- Reuses Passwords across sites: ${scoreCard.passwordReuse ? "Yes" : "No"}
- Has shared password with friends: ${scoreCard.passwordSharing ? "Yes" : "No"}
- Uses password manager: ${scoreCard.usePasswordManager ? "Yes" : "No"}
- Connects to Public Wi-Fi without VPN: ${scoreCard.usePublicWifiNoVPN ? "Yes" : "No"}
- Software Update Habit: ${scoreCard.softwareUpdateFrequency}
- Clicks email links: ${scoreCard.clicksEmailLinks}
- Shares device with no passcode protection: ${scoreCard.sharesDevicesNoPasscode ? "Yes" : "No"}

Actual Attack Encounter History:
- Hit by Phishing: ${scoreCard.hadPhishingEncounter ? "Yes" : "No"}
- Had Malware infection: ${scoreCard.hadMalwareInfection ? "Yes" : "No"}
- Account hacked/compromised: ${scoreCard.hadUnauthorizedAccess ? "Yes" : "No"}
- Financial scam victim: ${scoreCard.lostMoneyToScam ? "Yes" : "No"}

Based on these parameters, please generate a highly customized 'Data-Driven Cybersecurity Audit & Advisory Report' for this student.
The report must include:
1. **Executive Risk Profile**: A brief diagnostic interpretation of their scores. Contrast their behavior with typical academic cyber threats.
2. **Analysis of Weaknesses & Unsafe Practices**: Highlight exactly which of their behaviors represent critical entry points for cybercriminals.
3. **Role of Data Analytics in Their Protection**: Explain how a university's network telemetry, log analysis, and threat hunting algorithms (e.g. credential stuffing detection, risk scores) could intercept and protect them from these specific habits.
4. **Actionable Remediation Roadmap**: Provide 3 concrete, realistic safety steps optimized for a Nigerian student's daily ecosystem (e.g., banking apps, university portals, mobile data challenges, public hostel Wi-Fi risks).
        `;
      } else if (mode === "research_question") {
        prompt = `
Analyze the following academic inquiry in the context of the research topic: "CYBER SECURITY AWARENESS AND THE ROLE OF DATA ANALYTICS IN PREVENTING CYBERCRIME AMONG UNIVERSITY STUDENTS (A CASE STUDY OF NIGERIA)".

User Academic Inquiry: "${question}"

Please provide a sophisticated, well-structured scientific analysis. The response should:
1. Ground the answer in the specific cybercrime landscape of Nigerian universities (such as banking scams, SIM swapping, phishing, credentials harvesting on school portals like EduPortal, and WhatsApp hijacks).
2. Detail the **Role of Data Analytics** (e.g. log correlation, threat analytics, user behavior analytics (UBA), anomaly detection, and predictive modeling) in solving or investigating this challenge.
3. Cite patterns of unsafe student practices (e.g. lack of multi-factor authentication, sharing logins due to group assignments, insecure cybercafes).
4. Outline a proactive, data-informed strategy that Nigerian academic institutions should deploy to mitigate these crimes.
        `;
      } else {
        return res.status(400).json({ error: "Invalid mode requested" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini API Error in /api/ai-analysis:", error);
      res.status(500).json({
        error: "Failed to generate AI analysis. The server encountered an issue connecting to Google Gemini.",
        message: error.message
      });
    }
  });

  // Vite integration for development vs. production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Development Mode: Vite middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production Mode: Serving compiled static assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
