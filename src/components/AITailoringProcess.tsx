
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface AITailoringProcessProps {
  onProcess: () => void;
  isProcessing: boolean;
  resumeUploaded: boolean;
  jobProvided: boolean;
}

export const AITailoringProcess = ({ 
  onProcess, 
  isProcessing, 
  resumeUploaded,
  jobProvided 
}: AITailoringProcessProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 95); // Cap at 95% until done
          return newProgress;
        });
      }, 800);

      return () => {
        clearInterval(interval);
        setProgress(100); // When done processing
      };
    }
  }, [isProcessing]);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <Button 
          onClick={onProcess}
          disabled={isProcessing || !resumeUploaded || !jobProvided}
          className="w-full sm:w-auto relative bg-resume hover:bg-resume-dark text-white"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Tailoring Resume...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Tailor Resume with AI</span>
            </>
          )}
        </Button>

        {isProcessing && (
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Analyzing</span>
              <span>Customizing</span>
              <span>Finalizing</span>
            </div>
          </div>
        )}

        {(!resumeUploaded || !jobProvided) && (
          <p className="text-sm text-amber-600 mt-3">
            {!resumeUploaded && !jobProvided
              ? "Please upload a resume and provide job details"
              : !resumeUploaded
              ? "Please upload a LaTeX resume"
              : "Please provide job description or URL"}
          </p>
        )}
      </div>
    </div>
  );
};
