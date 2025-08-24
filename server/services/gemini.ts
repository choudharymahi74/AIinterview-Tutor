import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "" 
});

export interface GenerateQuestionsRequest {
  jobRole: string;
  experienceLevel: string;
  techStack: string[];
  questionCount: number;
}

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'situational';
  expectedAreas: string[];
}

export interface EvaluateResponseRequest {
  question: string;
  response: string;
  jobRole: string;
  experienceLevel: string;
}

export interface ResponseEvaluation {
  score: number; // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
  confidenceLevel: number; // 0-100
  communicationScore: number; // 0-10
  technicalScore: number; // 0-10
}

export class GeminiService {
  async generateInterviewQuestions(request: GenerateQuestionsRequest): Promise<InterviewQuestion[]> {
    try {
      const systemPrompt = `You are an expert technical interviewer. Generate ${request.questionCount} interview questions for a ${request.experienceLevel} ${request.jobRole} position.

Tech stack: ${request.techStack.join(', ')}

Create a balanced mix of:
- 60% Technical questions (coding, system design, specific technologies)
- 25% Behavioral questions (teamwork, leadership, problem-solving)
- 15% Situational questions (handling conflicts, deadlines, challenges)

For each question, specify:
- The exact question text
- Question type (technical/behavioral/situational)
- Key areas the response should cover

Respond with valid JSON array format.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                type: { type: "string", enum: ["technical", "behavioral", "situational"] },
                expectedAreas: { type: "array", items: { type: "string" } }
              },
              required: ["question", "type", "expectedAreas"]
            }
          }
        },
        contents: `Generate interview questions for: ${request.jobRole} (${request.experienceLevel}) with tech stack: ${request.techStack.join(', ')}`
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from Gemini");
      }

      return JSON.parse(rawJson);
    } catch (error) {
      console.error("Error generating questions:", error);
      throw new Error(`Failed to generate interview questions: ${error}`);
    }
  }

  async evaluateResponse(request: EvaluateResponseRequest): Promise<ResponseEvaluation> {
    try {
      const systemPrompt = `You are an expert interview evaluator. Analyze the candidate's response and provide structured feedback.

Evaluate based on:
1. Technical accuracy and depth (for technical questions)
2. Communication clarity and structure
3. Confidence and presentation
4. Completeness of the answer
5. Practical experience demonstration

Provide scores:
- Overall score: 0-10 (10 being excellent)
- Communication score: 0-10 (clarity, structure, articulation)
- Technical score: 0-10 (accuracy, depth, practical knowledge)
- Confidence level: 0-100 (body language, tone, conviction)

Give specific, actionable feedback including strengths and areas for improvement.

Respond with valid JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              score: { type: "number" },
              feedback: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              improvements: { type: "array", items: { type: "string" } },
              confidenceLevel: { type: "number" },
              communicationScore: { type: "number" },
              technicalScore: { type: "number" }
            },
            required: ["score", "feedback", "strengths", "improvements", "confidenceLevel", "communicationScore", "technicalScore"]
          }
        },
        contents: `
Position: ${request.jobRole} (${request.experienceLevel})
Question: ${request.question}
Candidate Response: ${request.response}

Evaluate this response comprehensively.`
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from Gemini");
      }

      return JSON.parse(rawJson);
    } catch (error) {
      console.error("Error evaluating response:", error);
      throw new Error(`Failed to evaluate response: ${error}`);
    }
  }

  async generateOverallFeedback(responses: ResponseEvaluation[]): Promise<string> {
    try {
      const systemPrompt = `You are an expert career coach. Based on the individual question evaluations, provide comprehensive interview feedback.

Include:
1. Overall performance summary
2. Key strengths demonstrated
3. Primary areas for improvement
4. Specific actionable recommendations
5. Next steps for skill development

Make it encouraging but honest, with concrete advice.`;

      const evaluationSummary = responses.map((r, i) => 
        `Question ${i + 1}: Score ${r.score}/10, Confidence ${r.confidenceLevel}%`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: `Based on these interview question evaluations:\n\n${evaluationSummary}\n\nProvide comprehensive feedback for the candidate.`
      });

      return response.text || "Unable to generate overall feedback";
    } catch (error) {
      console.error("Error generating overall feedback:", error);
      throw new Error(`Failed to generate overall feedback: ${error}`);
    }
  }
}

export const geminiService = new GeminiService();
