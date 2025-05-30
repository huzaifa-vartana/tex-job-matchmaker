
import { useState } from "react";
import { ResumeUploader } from "@/components/ResumeUploader";
import { JobDescription } from "@/components/JobDescription";
import { ResumePreview } from "@/components/ResumePreview";
import { AITailoringProcess } from "@/components/AITailoringProcess";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/components/ui/use-toast";
import { AppHeader } from "@/components/AppHeader";

const Index = () => {
  const [resumeContent, setResumeContent] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobUrl, setJobUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tailoredResume, setTailoredResume] = useState<string>("");
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const { toast } = useToast();

  const handleResumeUpload = (content: string, fileName: string) => {
    setResumeContent(content);
    setResumeFileName(fileName);
    toast({
      title: "Resume Uploaded",
      description: `Successfully loaded ${fileName}`,
    });
  };

  const handleJobDescriptionChange = (description: string) => {
    setJobDescription(description);
  };

  const handleJobUrlChange = (url: string) => {
    setJobUrl(url);
  };

  const handleTailorResume = async () => {
    if (!resumeContent) {
      toast({
        title: "Missing Resume",
        description: "Please upload a LaTeX resume file first",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription && !jobUrl) {
      toast({
        title: "Missing Job Information",
        description: "Please provide either a job description or URL",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // In a real app, this would call an API to process the resume
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating API call
      
      // For demo purposes, we'll just modify the resume slightly
      const tailored = await simulateAITailoring(resumeContent, jobDescription || jobUrl);
      setTailoredResume(tailored);
      toast({
        title: "Resume Tailored",
        description: "Your resume has been customized for this job!",
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to tailor resume. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulates AI tailoring for demo purposes
  const simulateAITailoring = async (resume: string, job: string): Promise<string> => {
    // This is a simplified example - in a real app, you'd use an AI service
    const sections = {
      skills: ["communication", "teamwork", "problem-solving", "adaptability", "leadership"],
      keywords: ["project management", "agile", "data analysis", "machine learning", "typescript"]
    };
    
    // Check for keywords in the job description
    const relevantSkills = sections.skills.filter(skill => 
      job.toLowerCase().includes(skill.toLowerCase())
    );
    
    const relevantKeywords = sections.keywords.filter(keyword => 
      job.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Add those keywords to the resume if not already there
    let tailoredResume = resume;
    
    // Simple modifications for demo purposes
    if (relevantSkills.length > 0) {
      tailoredResume = tailoredResume.replace(
        /\\section{Skills}/i,
        `\\section{Skills}\n% Added based on job requirements\n\\textbf{${relevantSkills.join(', ')}}`
      );
    }
    
    if (relevantKeywords.length > 0) {
      tailoredResume = tailoredResume.replace(
        /\\begin{document}/i,
        `\\begin{document}\n% Tailored for job with focus on: ${relevantKeywords.join(', ')}`
      );
    }
    
    return tailoredResume;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto py-8 px-4 md:px-8">
        <Card className="mb-8 border-t-4 border-t-resume shadow-lg">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-resume mb-2">Resume Tailoring Assistant</h1>
            <p className="text-gray-600 mb-4">
              Upload your LaTeX resume and provide a job description or URL to customize your resume for the specific position.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResumeUploader onUpload={handleResumeUpload} />
              </div>
              
              <div>
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Job Description</TabsTrigger>
                    <TabsTrigger value="url">Job URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description">
                    <JobDescription 
                      value={jobDescription} 
                      onChange={handleJobDescriptionChange} 
                      type="text"
                    />
                  </TabsContent>
                  <TabsContent value="url">
                    <JobDescription 
                      value={jobUrl} 
                      onChange={handleJobUrlChange} 
                      type="url"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="mt-6">
              <AITailoringProcess 
                onProcess={handleTailorResume} 
                isProcessing={isProcessing}
                resumeUploaded={!!resumeContent}
                jobProvided={!!(jobDescription || jobUrl)}
              />
            </div>
          </CardContent>
        </Card>
        
        {tailoredResume && (
          <ResumePreview 
            originalContent={resumeContent}
            tailoredContent={tailoredResume} 
            fileName={resumeFileName}
          />
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
