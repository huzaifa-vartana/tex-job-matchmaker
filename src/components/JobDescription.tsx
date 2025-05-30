
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CircleHelp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  type: 'text' | 'url';
}

export const JobDescription = ({ value, onChange, type }: JobDescriptionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-semibold">
          {type === 'text' ? 'Job Description' : 'Job Posting URL'}
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2">
                <CircleHelp className="h-4 w-4 text-gray-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {type === 'text' 
                ? 'Paste the full job description here to analyze requirements and tailor your resume.' 
                : 'Enter the URL of the job posting. Our system will extract the job description automatically.'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {type === 'text' ? (
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste full job description here..."
          className="min-h-[200px] resize-y"
        />
      ) : (
        <Input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder="https://company.com/careers/job-posting"
          className="w-full"
        />
      )}
    </div>
  );
};
