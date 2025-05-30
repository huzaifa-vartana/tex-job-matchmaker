
import { useState, useEffect } from "react";
import { ResumeUploader } from "@/components/ResumeUploader";
import { JobDescription } from "@/components/JobDescription";
import { ResumePreview } from "@/components/ResumePreview";
import { AITailoringProcess } from "@/components/AITailoringProcess";
import { OpenAIKeyInput } from "@/components/OpenAIKeyInput";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/components/ui/use-toast";
import { AppHeader } from "@/components/AppHeader";
import { tailorResumeWithOpenAI } from "@/services/openai";
import { getStoredApiKey, storeApiKey } from "@/utils/storage";
import { toast } from "sonner";

const Index = () => {
  const [resumeContent, setResumeContent] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobUrl, setJobUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tailoredResume, setTailoredResume] = useState<string>("");
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Load the API key from localStorage on component mount
    const storedKey = getStoredApiKey();
    setOpenAIKey(storedKey);
  }, []);

  const handleResumeUpload = (content: string, fileName: string) => {
    setResumeContent(content);
    setResumeFileName(fileName);
    uiToast({
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

  const handleApiKeyChange = (key: string) => {
    setOpenAIKey(key);
    storeApiKey(key);
  };

  const handleTailorResume = async () => {
    if (!resumeContent) {
      uiToast({
        title: "Missing Resume",
        description: "Please upload a LaTeX resume file first",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription && !jobUrl) {
      uiToast({
        title: "Missing Job Information",
        description: "Please provide either a job description or URL",
        variant: "destructive",
      });
      return;
    }

    if (!openAIKey) {
      uiToast({
        title: "OpenAI API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Use the job description or URL content
      const jobContent = jobDescription || `Job URL: ${jobUrl}`;
      
      // Call the OpenAI service
      const tailored = await tailorResumeWithOpenAI(
        resumeContent, 
        jobContent,
        { apiKey: openAIKey }
      );
      
      setTailoredResume(tailored);
      toast.success("Resume tailored successfully for this job!");
    } catch (error) {
      toast.error("Failed to tailor resume: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
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
            
            <div className="mt-6 border-t pt-4">
              <div className="mb-4">
                <OpenAIKeyInput 
                  apiKey={openAIKey} 
                  onChange={handleApiKeyChange}
                />
              </div>
              
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
