
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
Focus on:
1. Highlighting relevant skills and experience
2. Adjusting emphasis on accomplishments that align with the job
3. Adding relevant keywords naturally 
4. Reorganizing content priority if needed
5. Respecting the LaTeX format and structure
6. Only modifying existing content, do not invent details

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
