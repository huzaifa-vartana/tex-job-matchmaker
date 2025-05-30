
import { toast } from "sonner";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
}

export const tailorResumeWithOpenAI = async (
  resumeContent: string,
  jobDescription: string,
  config: OpenAIConfig
): Promise<string> => {
  try {
    const { apiKey, model = "gpt-4o" } = config;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    const prompt = `
You are an expert resume tailoring assistant. Your task is to modify a LaTeX resume to better match a job description.

## IMPORTANT: DO NOT CHANGE THESE ELEMENTS:
- Resume header with name and contact information
- Company names where the person worked
- Dates of employment or education
- School/university names and degrees
- Any certification names and dates

## ONLY MODIFY:
1. Experience bullet points - rewrite, reorder, or reprioritize based on job relevance
2. Projects - add/remove/modify based on relevance to the job
3. Skills section - add relevant skills mentioned in the resume that match the job, remove irrelevant ones
4. Summary/objective statement if it exists

## INSTRUCTIONS:
- Keep all LaTeX formatting and commands intact
- For each role/experience, focus the bullet points on achievements and skills most relevant to the job
- Move more relevant projects to the top of project lists
- Emphasize keywords from the job description if they genuinely match the person's background
- Keep the document length the same or shorter than the original

Here is the job description:
${jobDescription}

Here is the LaTeX resume to tailor:
${resumeContent}

Please return ONLY the modified LaTeX code, with no additional text, explanations, or formatting. Keep the modified resume fully functional as a LaTeX document.
`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert resume tailoring assistant that modifies LaTeX resumes to match job descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to tailor resume");
    }

    const data = await response.json();
    const tailoredContent = data.choices[0].message.content.trim();
    
    return tailoredContent;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    toast.error("Failed to process with OpenAI: " + (error as Error).message);
    throw error;
  }
};
