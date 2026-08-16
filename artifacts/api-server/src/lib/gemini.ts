import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AiAnalysisResult {
  title: string;
  summary: string;
  category: string;
  severityScore: number;
  urgency: string;
  department: string;
  environmentalImpact: string;
  resolutionEstimate: string;
  suggestedActions: string[];
  confidenceScore: number;
  priority: string;
}

const CATEGORIES = [
  "garbage",
  "water_leakage",
  "broken_streetlight",
  "road_damage",
  "illegal_dumping",
  "public_safety",
  "drainage",
  "pothole",
  "other",
];

export async function analyzeWithGemini(
  description: string,
  category?: string,
  imageData?: string,
  imageMimeType?: string
): Promise<AiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const prompt = `
Analyze this civic complaint and return ONLY valid JSON.

Description: ${description}
Category: ${category || "not provided"}

Return exactly:
{
  "title": "short professional title",
  "summary": "2-3 sentence summary",
  "category": "one of: ${CATEGORIES.join(", ")}",
  "severityScore": 1,
  "urgency": "immediate, high, medium, or low",
  "department": "responsible government department",
  "environmentalImpact": "brief assessment",
  "resolutionEstimate": "estimated resolution time",
  "suggestedActions": ["action 1", "action 2", "action 3"],
  "confidenceScore": 0.0,
  "priority": "low, medium, high, or critical"
}

severityScore must be 1-10.
confidenceScore must be 0-1.
`;

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];

  if (imageData && imageMimeType) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageData.includes(",") ? imageData.split(",")[1]! : imageData,
      },
    });
  }

  const result = await model.generateContent(parts);
  const text = result.response
    .text()
    .replace(/```json|```/gi, "")
    .trim();

  let parsed: AiAnalysisResult;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  parsed.severityScore = Math.max(
    1,
    Math.min(10, Math.round(parsed.severityScore))
  );
  parsed.confidenceScore = Math.max(
    0,
    Math.min(1, parsed.confidenceScore)
  );

  return parsed;
}